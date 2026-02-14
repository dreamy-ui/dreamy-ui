"use client";

import { useCallbackRef } from "@/hooks";
import { createContext } from "@/provider";
import { type ReactNode, useCallback, useEffect, useId, useRef, useState } from "react";

// ─── Types ───────────────────────────────────────────────────────────────────

export type FileErrorType =
    | "FILE_TOO_LARGE"
    | "FILE_TOO_SMALL"
    | "FILE_INVALID_TYPE"
    | "TOO_MANY_FILES"
    | "CUSTOM";

export interface FileError {
    type: FileErrorType;
    message: string;
}

export interface FileRejection {
    file: File;
    errors: FileError[];
}

export interface FileChangeDetails {
    acceptedFiles: File[];
    rejectedFiles: FileRejection[];
}

export interface FileAcceptDetails {
    files: File[];
}

export interface FileRejectDetails {
    files: FileRejection[];
}

export interface UseFileUploadProps {
    /**
     * Accepted file types. Can be MIME types (e.g. "image/*", "application/pdf"),
     * file extensions (e.g. ".png", ".jpg"), or an array of them.
     */
    accept?: string | string[];
    /**
     * Maximum number of files that can be uploaded.
     * @default 1
     */
    maxFiles?: number;
    /**
     * Maximum file size. Accepts a number (bytes) or a string with a unit
     * (e.g. `"5MB"`, `"1GB"`, `"500KB"`).
     * @default Infinity
     */
    maxFileSize?: FileSize;
    /**
     * Minimum file size. Accepts a number (bytes) or a string with a unit
     * (e.g. `"100KB"`, `"1MB"`).
     * @default 0
     */
    minFileSize?: FileSize;
    /**
     * Whether to allow drag and drop in the dropzone.
     * @default true
     */
    allowDrop?: boolean;
    /**
     * Whether to allow selecting directories.
     */
    directory?: boolean;
    /**
     * The camera to use when capturing media.
     */
    capture?: "user" | "environment";
    /**
     * Whether the file upload is disabled.
     * @default false
     */
    disabled?: boolean;
    /**
     * Whether the file upload is required.
     * @default false
     */
    required?: boolean;
    /**
     * Whether the file upload is invalid.
     * @default false
     */
    invalid?: boolean;
    /**
     * The name attribute for the hidden file input.
     */
    name?: string;
    /**
     * Callback when files are accepted.
     */
    onFileAccept?: (details: FileAcceptDetails) => void;
    /**
     * Callback when files are rejected.
     */
    onFileReject?: (details: FileRejectDetails) => void;
    /**
     * Callback when files change (both accepted and rejected).
     */
    onFileChange?: (details: FileChangeDetails) => void;
    /**
     * Custom validation function for each file.
     */
    validate?: (file: File) => FileError[] | null;
    /**
     * Whether to prevent the default document drop behavior.
     * @default true
     */
    preventDocumentDrop?: boolean;
    /**
     * The locale for formatting file sizes.
     * @default "en-US"
     */
    locale?: string;
    /**
     * Children
     */
    children?: ReactNode;
}

export interface UseFileUploadReturn {
    /** Currently accepted files */
    acceptedFiles: File[];
    /** Currently rejected files */
    rejectedFiles: FileRejection[];
    /** Whether files are being dragged over the dropzone */
    isDragging: boolean;
    /** Whether the file upload is disabled */
    disabled: boolean;
    /** Whether the file upload is invalid */
    invalid: boolean;
    /** Whether the file upload is required */
    required: boolean;
    /** The locale for formatting */
    locale: string;
    /** Remove all accepted files */
    clearFiles: () => void;
    /** Remove a specific file */
    removeFile: (file: File) => void;
    /** Programmatically set files (goes through validation) */
    setFiles: (files: File[]) => void;
    /** Open the native file picker */
    openFilePicker: () => void;
    /** Handle clipboard paste */
    setClipboardFiles: (data: DataTransfer) => void;
    /** Props for the root element */
    getRootProps: () => Record<string, any>;
    /** Props for the dropzone element */
    getDropzoneProps: () => Record<string, any>;
    /** Props for the hidden file input */
    getInputProps: () => Record<string, any>;
    /** Props for the trigger element */
    getTriggerProps: () => Record<string, any>;
    /** The unique id for the file upload */
    id: string;
}

// ─── Context ─────────────────────────────────────────────────────────────────

export const [FileUploadProvider, useFileUploadContext] = createContext<UseFileUploadReturn>({
    strict: true,
    name: "FileUploadContext",
    hookName: "useFileUploadContext",
    providerName: "FileUpload.Root"
});

// ─── File Size Parsing ────────────────────────────────────────────────────────

/**
 * A file size value. Can be:
 * - A `number` representing bytes (e.g. `3000000`)
 * - A `string` with a number followed by a unit (e.g. `"3MB"`, `"1.5GB"`, `"500KB"`)
 *
 * Supported units (case-insensitive): `B`, `KB`, `MB`, `GB`, `TB`
 */
export type FileSize = number | `${number}${"B" | "KB" | "MB" | "GB" | "TB"}`;

const FILE_SIZE_UNITS: Record<string, number> = {
    b: 1,
    kb: 1024,
    mb: 1024 ** 2,
    gb: 1024 ** 3,
    tb: 1024 ** 4
};

/**
 * Parse a file size value into bytes.
 *
 * Accepts a plain number (returned as-is) or a string like `"5MB"`, `"1.5GB"`, `"512KB"`.
 * Supported units (case-insensitive): `B`, `KB`, `MB`, `GB`, `TB`.
 *
 * @example
 * parseFileSize(3000000)   // 3000000
 * parseFileSize("3MB")     // 3145728
 * parseFileSize("1.5GB")   // 1610612736
 * parseFileSize("512KB")   // 524288
 */
export function parseFileSize(value: FileSize): number {
    if (typeof value === "number") return value;

    const match = value.match(/^\s*(\d+(?:\.\d+)?)\s*(b|kb|mb|gb|tb)\s*$/i);
    if (!match) {
        throw new Error(
            `Invalid file size: "${value}". Expected a number or a string like "5MB", "1.5GB", "512KB".`
        );
    }

    const num = Number.parseFloat(match[1]);
    const unit = match[2].toLowerCase();

    return Math.floor(num * FILE_SIZE_UNITS[unit]);
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function isAcceptedType(file: File, accept?: string | string[]): boolean {
    if (!accept) return true;

    const acceptArray = Array.isArray(accept) ? accept : accept.split(",").map((s) => s.trim());

    return acceptArray.some((type) => {
        // File extension check (e.g. ".png", ".jpg")
        if (type.startsWith(".")) {
            return file.name.toLowerCase().endsWith(type.toLowerCase());
        }
        // Wildcard MIME type (e.g. "image/*")
        if (type.endsWith("/*")) {
            const prefix = type.slice(0, type.indexOf("/"));
            return file.type.startsWith(`${prefix}/`);
        }
        // Exact MIME type (e.g. "application/pdf")
        return file.type === type;
    });
}

function getAcceptAttr(accept?: string | string[]): string | undefined {
    if (!accept) return undefined;
    if (Array.isArray(accept)) return accept.join(",");
    return accept;
}

function formatFileSize(bytes: number, locale = "en-US"): string {
    if (bytes === 0) return "0 B";
    const units = ["B", "KB", "MB", "GB", "TB"];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    const size = bytes / 1024 ** i;
    return `${new Intl.NumberFormat(locale, { maximumFractionDigits: 1 }).format(size)} ${units[i]}`;
}

export { formatFileSize };

// ─── Hook ────────────────────────────────────────────────────────────────────

export function useFileUpload(props: UseFileUploadProps = {}): UseFileUploadReturn {
    const {
        accept,
        maxFiles = 1,
        maxFileSize: maxFileSizeRaw = Number.POSITIVE_INFINITY,
        minFileSize: minFileSizeRaw = 0,
        allowDrop = true,
        directory = false,
        capture,
        disabled = false,
        required = false,
        invalid = false,
        name,
        onFileAccept,
        onFileReject,
        onFileChange,
        validate,
        preventDocumentDrop = true,
        locale = "en-US"
    } = props;

    const maxFileSize =
        typeof maxFileSizeRaw === "string" ? parseFileSize(maxFileSizeRaw) : maxFileSizeRaw;
    const minFileSize =
        typeof minFileSizeRaw === "string" ? parseFileSize(minFileSizeRaw) : minFileSizeRaw;

    const reactId = useId();
    const id = `file-upload-${reactId}`;

    const inputRef = useRef<HTMLInputElement>(null);
    const [acceptedFiles, setAcceptedFiles] = useState<File[]>([]);
    const [rejectedFiles, setRejectedFiles] = useState<FileRejection[]>([]);
    const [isDragging, setIsDragging] = useState(false);
    const dragCounter = useRef(0);

    const onFileAcceptRef = useCallbackRef(onFileAccept);
    const onFileRejectRef = useCallbackRef(onFileReject);
    const onFileChangeRef = useCallbackRef(onFileChange);
    const validateRef = useCallbackRef(validate);

    const processFiles = useCallback(
        (incomingFiles: File[]) => {
            if (disabled) return;

            const newAccepted: File[] = [];
            const newRejected: FileRejection[] = [];

            for (const file of incomingFiles) {
                const errors: FileError[] = [];

                // Type validation
                if (!isAcceptedType(file, accept)) {
                    errors.push({
                        type: "FILE_INVALID_TYPE",
                        message: `File type "${file.type || "unknown"}" is not accepted`
                    });
                }

                // Size validation
                if (file.size > maxFileSize) {
                    errors.push({
                        type: "FILE_TOO_LARGE",
                        message: `File is too large. Max size is ${formatFileSize(maxFileSize, locale)}`
                    });
                }

                if (file.size < minFileSize) {
                    errors.push({
                        type: "FILE_TOO_SMALL",
                        message: `File is too small. Min size is ${formatFileSize(minFileSize, locale)}`
                    });
                }

                // Custom validation
                const customErrors = validateRef?.(file);
                if (customErrors) {
                    errors.push(...customErrors);
                }

                if (errors.length > 0) {
                    newRejected.push({ file, errors });
                } else {
                    newAccepted.push(file);
                }
            }

            // Check max files limit
            const totalAccepted = [...acceptedFiles, ...newAccepted];
            const overflow = totalAccepted.length - maxFiles;

            if (overflow > 0) {
                const overflowFiles = newAccepted.splice(newAccepted.length - overflow, overflow);
                for (const file of overflowFiles) {
                    newRejected.push({
                        file,
                        errors: [
                            {
                                type: "TOO_MANY_FILES",
                                message: `Too many files. Max is ${maxFiles}`
                            }
                        ]
                    });
                }
            }

            const finalAccepted = [...acceptedFiles, ...newAccepted];
            setAcceptedFiles(finalAccepted);
            setRejectedFiles(newRejected);

            if (newAccepted.length > 0) {
                onFileAcceptRef?.({ files: newAccepted });
            }
            if (newRejected.length > 0) {
                onFileRejectRef?.({ files: newRejected });
            }
            onFileChangeRef?.({
                acceptedFiles: finalAccepted,
                rejectedFiles: newRejected
            });
        },
        [
            disabled,
            accept,
            maxFileSize,
            minFileSize,
            maxFiles,
            locale,
            acceptedFiles,
            validateRef,
            onFileAcceptRef,
            onFileRejectRef,
            onFileChangeRef
        ]
    );

    const clearFiles = useCallback(() => {
        setAcceptedFiles([]);
        setRejectedFiles([]);
        if (inputRef.current) {
            inputRef.current.value = "";
        }
        onFileChangeRef?.({
            acceptedFiles: [],
            rejectedFiles: []
        });
    }, [onFileChangeRef]);

    const removeFile = useCallback(
        (file: File) => {
            const newAccepted = acceptedFiles.filter((f) => f !== file);
            setAcceptedFiles(newAccepted);
            if (inputRef.current) {
                inputRef.current.value = "";
            }
            onFileChangeRef?.({
                acceptedFiles: newAccepted,
                rejectedFiles
            });
        },
        [acceptedFiles, rejectedFiles, onFileChangeRef]
    );

    const setFiles = useCallback(
        (files: File[]) => {
            setAcceptedFiles([]);
            setRejectedFiles([]);
            processFiles(files);
        },
        [processFiles]
    );

    const openFilePicker = useCallback(() => {
        if (disabled) return;
        inputRef.current?.click();
    }, [disabled]);

    const setClipboardFiles = useCallback(
        (data: DataTransfer) => {
            if (disabled) return;
            const files = Array.from(data.files);
            if (files.length > 0) {
                processFiles(files);
            }
        },
        [disabled, processFiles]
    );

    // ─── Prop getters ────────────────────────────────────────────────────────

    const getRootProps = useCallback(
        () => ({
            "data-scope": "file-upload",
            "data-part": "root",
            "data-disabled": disabled || undefined,
            "data-invalid": invalid || undefined,
            id
        }),
        [disabled, invalid, id]
    );

    const getDropzoneProps = useCallback(
        () => ({
            "data-scope": "file-upload",
            "data-part": "dropzone",
            "data-dragging": isDragging || undefined,
            "data-disabled": disabled || undefined,
            tabIndex: disabled ? undefined : 0,
            role: "button" as const,
            onDragEnter: (e: React.DragEvent) => {
                if (!allowDrop || disabled) return;
                e.preventDefault();
                e.stopPropagation();
                dragCounter.current++;
                if (e.dataTransfer.items?.length) {
                    setIsDragging(true);
                }
            },
            onDragOver: (e: React.DragEvent) => {
                if (!allowDrop || disabled) return;
                e.preventDefault();
                e.stopPropagation();
            },
            onDragLeave: (e: React.DragEvent) => {
                if (!allowDrop || disabled) return;
                e.preventDefault();
                e.stopPropagation();
                dragCounter.current--;
                if (dragCounter.current === 0) {
                    setIsDragging(false);
                }
            },
            onDrop: (e: React.DragEvent) => {
                if (!allowDrop || disabled) return;
                e.preventDefault();
                e.stopPropagation();
                dragCounter.current = 0;
                setIsDragging(false);
                const files = Array.from(e.dataTransfer.files);
                processFiles(files);
            },
            onClick: () => {
                if (!disabled) {
                    openFilePicker();
                }
            },
            onKeyDown: (e: React.KeyboardEvent) => {
                if ((e.key === "Enter" || e.key === " ") && !disabled) {
                    e.preventDefault();
                    openFilePicker();
                }
            }
        }),
        [isDragging, disabled, allowDrop, processFiles, openFilePicker]
    );

    const getInputProps = useCallback(
        () => ({
            ref: inputRef,
            type: "file" as const,
            accept: getAcceptAttr(accept),
            multiple: maxFiles > 1,
            name,
            disabled,
            required,
            capture: capture as string | undefined,
            onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
                const files = Array.from(e.target.files || []);
                processFiles(files);
                // Reset the input value so the same file can be selected again
                e.target.value = "";
            },
            tabIndex: -1,
            style: {
                border: 0,
                clip: "rect(0, 0, 0, 0)",
                height: "1px",
                margin: "-1px",
                overflow: "hidden",
                padding: 0,
                position: "absolute" as const,
                width: "1px",
                whiteSpace: "nowrap" as const,
                wordWrap: "normal" as const
            },
            "data-scope": "file-upload",
            "data-part": "hidden-input",
            ...(directory ? { webkitdirectory: "", directory: "" } : {})
        }),
        [accept, maxFiles, name, disabled, required, capture, directory, processFiles]
    );

    const getTriggerProps = useCallback(
        () => ({
            "data-scope": "file-upload",
            "data-part": "trigger",
            "data-disabled": disabled || undefined,
            type: "button" as const,
            disabled,
            onClick: () => {
                if (!disabled) {
                    openFilePicker();
                }
            }
        }),
        [disabled, openFilePicker]
    );

    // Prevent document-level drops
    useEffect(() => {
        if (typeof window === "undefined" || !preventDocumentDrop) return;

        function handleDocDragOver(e: Event) {
            e.preventDefault();
        }
        function handleDocDrop(e: Event) {
            e.preventDefault();
        }

        document.addEventListener("dragover", handleDocDragOver);
        document.addEventListener("drop", handleDocDrop);

        return () => {
            document.removeEventListener("dragover", handleDocDragOver);
            document.removeEventListener("drop", handleDocDrop);
        };
    }, [preventDocumentDrop]);

    return {
        acceptedFiles,
        rejectedFiles,
        isDragging,
        disabled,
        invalid,
        required,
        locale,
        clearFiles,
        removeFile,
        setFiles,
        openFilePicker,
        setClipboardFiles,
        getRootProps,
        getDropzoneProps,
        getInputProps,
        getTriggerProps,
        id
    };
}
