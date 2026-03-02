"use client";

import {
    FileUploadProvider,
    type UseFileUploadProps,
    type UseFileUploadReturn,
    formatFileSize,
    useFileUpload,
    useFileUploadContext
} from "@dreamy-ui/react";
import { forwardRef, useMemo } from "react";
import { type HTMLDreamyProps, createStyleContext, dreamy } from "styled-system/jsx";
import { fileUpload } from "styled-system/recipes";

const { withProvider, withContext } = createStyleContext(fileUpload);

// ─── Root ────────────────────────────────────────────────────────────────────

interface RootBaseProps extends UseFileUploadProps {}

const StyledRoot = withProvider(dreamy.div, "root");

/**
 * FileUpload.Root
 *
 * The root container for the file upload component.
 * Includes the hidden file input automatically.
 *
 * @See Docs https://dreamy-ui.com/docs/components/file-upload
 */
export const Root = forwardRef<HTMLDivElement, RootBaseProps & HTMLDreamyProps<"div">>(
    function FileUploadRoot(props, ref) {
        const {
            accept,
            maxFiles,
            maxFileSize,
            minFileSize,
            allowDrop,
            directory,
            capture,
            disabled,
            required,
            invalid,
            name,
            onFileAccept,
            onFileReject,
            onFileChange,
            validate,
            preventDocumentDrop,
            locale,
            children,
            ...rest
        } = props;

        const fileUpload = useFileUpload({
            accept,
            maxFiles,
            maxFileSize,
            minFileSize,
            allowDrop,
            directory,
            capture,
            disabled,
            required,
            invalid,
            name,
            onFileAccept,
            onFileReject,
            onFileChange,
            validate,
            preventDocumentDrop,
            locale
        });

        return (
            <FileUploadProvider value={fileUpload}>
                <StyledRoot
                    ref={ref}
                    {...fileUpload.getRootProps()}
                    {...rest}
                >
                    <input {...fileUpload.getInputProps()} />
                    {children}
                </StyledRoot>
            </FileUploadProvider>
        );
    }
);

// ─── RootProvider ────────────────────────────────────────────────────────────

interface RootProviderProps {
    value: UseFileUploadReturn;
    children?: React.ReactNode;
}

const StyledRootProvider = withProvider(dreamy.div, "root");

/**
 * FileUpload.RootProvider
 *
 * Use this when you want to control the file upload externally
 * via the useFileUpload hook.
 */
export const RootProvider = forwardRef<HTMLDivElement, RootProviderProps & HTMLDreamyProps<"div">>(
    function FileUploadRootProvider(props, ref) {
        const { value, children, ...rest } = props;

        return (
            <FileUploadProvider value={value}>
                <StyledRootProvider
                    ref={ref}
                    {...value.getRootProps()}
                    {...rest}
                >
                    <input {...value.getInputProps()} />
                    {children}
                </StyledRootProvider>
            </FileUploadProvider>
        );
    }
);

// ─── Label ───────────────────────────────────────────────────────────────────

export const Label = withContext(dreamy.label, "label");

// ─── Dropzone ────────────────────────────────────────────────────────────────

const StyledDropzone = withContext(dreamy.div, "dropzone");

/**
 * FileUpload.Dropzone
 *
 * A drag-and-drop area for uploading files.
 */
export const Dropzone = forwardRef<HTMLDivElement, HTMLDreamyProps<"div">>(
    function FileUploadDropzone(props, ref) {
        const { children, ...rest } = props;
        const ctx = useFileUploadContext();

        return (
            <StyledDropzone
                ref={ref}
                {...ctx.getDropzoneProps()}
                {...rest}
            >
                {children}
            </StyledDropzone>
        );
    }
);

// ─── DropzoneContent ─────────────────────────────────────────────────────────

export const DropzoneContent = withContext(dreamy.div, "dropzoneContent");

// ─── Trigger ─────────────────────────────────────────────────────────────────

const StyledTrigger = withContext(dreamy.button, "trigger");

/**
 * FileUpload.Trigger
 *
 * A button that opens the file picker dialog.
 */
export const Trigger = forwardRef<HTMLButtonElement, HTMLDreamyProps<"button">>(
    function FileUploadTrigger(props, ref) {
        const { children, ...rest } = props;
        const ctx = useFileUploadContext();

        return (
            <StyledTrigger
                ref={ref}
                {...ctx.getTriggerProps()}
                {...rest}
            >
                {children}
            </StyledTrigger>
        );
    }
);

// ─── ItemGroup ───────────────────────────────────────────────────────────────

export const ItemGroup = withContext(dreamy.ul, "itemGroup");

// ─── Item ────────────────────────────────────────────────────────────────────

interface ItemProps {
    file: File;
    children?: React.ReactNode;
}

const StyledItem = withContext(dreamy.li, "item");

/**
 * FileUpload.Item
 *
 * Represents a single uploaded file in the list.
 */
export const Item = forwardRef<HTMLLIElement, ItemProps & HTMLDreamyProps<"li">>(
    function FileUploadItem(props, ref) {
        const { file, children, ...rest } = props;

        return (
            <StyledItem
                data-file={file.name}
                ref={ref}
                {...rest}
            >
                {children}
            </StyledItem>
        );
    }
);

// ─── ItemPreview ─────────────────────────────────────────────────────────────

interface ItemPreviewProps {
    file?: File;
    children?: React.ReactNode;
}

const StyledItemPreview = withContext(dreamy.div, "itemPreview");

/**
 * FileUpload.ItemPreview
 *
 * Displays a preview icon for the uploaded file.
 * If no children are provided, displays a default file icon.
 */
export const ItemPreview = forwardRef<HTMLDivElement, ItemPreviewProps & HTMLDreamyProps<"div">>(
    function FileUploadItemPreview(props, ref) {
        const { children, ...rest } = props;

        return (
            <StyledItemPreview
                ref={ref}
                {...rest}
            >
                {children || <DefaultFileIcon />}
            </StyledItemPreview>
        );
    }
);

// ─── ItemPreviewImage ────────────────────────────────────────────────────────

interface ItemPreviewImageProps {
    file: File;
}

const StyledItemPreviewImage = withContext(dreamy.img, "itemPreviewImage");

/**
 * FileUpload.ItemPreviewImage
 *
 * Displays an image preview for image files.
 */
export const ItemPreviewImage = forwardRef<
    HTMLImageElement,
    ItemPreviewImageProps & HTMLDreamyProps<"img">
>(function FileUploadItemPreviewImage(props, ref) {
    const { file, ...rest } = props;
    const src = useMemo(() => URL.createObjectURL(file), [file]);

    return (
        <StyledItemPreviewImage
            alt={file.name}
            ref={ref}
            src={src}
            {...rest}
        />
    );
});

// ─── ItemContent ─────────────────────────────────────────────────────────────

export const ItemContent = withContext(dreamy.div, "itemContent");

// ─── ItemName ────────────────────────────────────────────────────────────────

interface ItemNameProps {
    file: File;
    children?: React.ReactNode;
}

const StyledItemName = withContext(dreamy.span, "itemName");

/**
 * FileUpload.ItemName
 *
 * Displays the name of the uploaded file.
 */
export const ItemName = forwardRef<HTMLSpanElement, ItemNameProps & HTMLDreamyProps<"span">>(
    function FileUploadItemName(props, ref) {
        const { file, children, ...rest } = props;

        return (
            <StyledItemName
                ref={ref}
                {...rest}
            >
                {children || file.name}
            </StyledItemName>
        );
    }
);

// ─── ItemSizeText ────────────────────────────────────────────────────────────

interface ItemSizeTextProps {
    file: File;
    children?: React.ReactNode;
}

const StyledItemSizeText = withContext(dreamy.span, "itemSizeText");

/**
 * FileUpload.ItemSizeText
 *
 * Displays the file size in a human-readable format.
 */
export const ItemSizeText = forwardRef<
    HTMLSpanElement,
    ItemSizeTextProps & HTMLDreamyProps<"span">
>(function FileUploadItemSizeText(props, ref) {
    const { file, children, ...rest } = props;
    const ctx = useFileUploadContext();
    const sizeText = useMemo(() => formatFileSize(file.size, ctx.locale), [file.size, ctx.locale]);

    return (
        <StyledItemSizeText
            ref={ref}
            {...rest}
        >
            {children || sizeText}
        </StyledItemSizeText>
    );
});

// ─── ItemDeleteTrigger ───────────────────────────────────────────────────────

interface ItemDeleteTriggerProps {
    file: File;
    children?: React.ReactNode;
}

const StyledItemDeleteTrigger = withContext(dreamy.button, "itemDeleteTrigger");

/**
 * FileUpload.ItemDeleteTrigger
 *
 * A button to remove a specific file from the accepted list.
 */
export const ItemDeleteTrigger = forwardRef<
    HTMLButtonElement,
    ItemDeleteTriggerProps & HTMLDreamyProps<"button">
>(function FileUploadItemDeleteTrigger(props, ref) {
    const { file, children, ...rest } = props;
    const ctx = useFileUploadContext();

    return (
        <StyledItemDeleteTrigger
            aria-label={`Remove ${file.name}`}
            onClick={() => ctx.removeFile(file)}
            ref={ref}
            type="button"
            {...rest}
        >
            {children || <DefaultCloseIcon />}
        </StyledItemDeleteTrigger>
    );
});

// ─── ClearTrigger ────────────────────────────────────────────────────────────

const StyledClearTrigger = withContext(dreamy.button, "itemDeleteTrigger");

/**
 * FileUpload.ClearTrigger
 *
 * A button to clear all accepted files.
 */
export const ClearTrigger = forwardRef<HTMLButtonElement, HTMLDreamyProps<"button">>(
    function FileUploadClearTrigger(props, ref) {
        const { children, ...rest } = props;
        const ctx = useFileUploadContext();

        return (
            <StyledClearTrigger
                aria-label="Clear all files"
                onClick={() => ctx.clearFiles()}
                ref={ref}
                type="button"
                {...rest}
            >
                {children}
            </StyledClearTrigger>
        );
    }
);

// ─── FileText ────────────────────────────────────────────────────────────────

interface FileTextProps {
    fallback?: string;
    children?: React.ReactNode;
}

const StyledFileText = withContext(dreamy.span, "fileText");

/**
 * FileUpload.FileText
 *
 * Displays the selected file name(s), or a fallback text when no files are selected.
 */
export const FileText = forwardRef<HTMLSpanElement, FileTextProps & HTMLDreamyProps<"span">>(
    function FileUploadFileText(props, ref) {
        const { fallback = "Select file(s)", children, ...rest } = props;
        const ctx = useFileUploadContext();

        const fileText = useMemo(() => {
            const files = ctx.acceptedFiles;
            if (files.length === 1) return files[0].name;
            if (files.length > 1) return `${files.length} files`;
            return fallback;
        }, [ctx.acceptedFiles, fallback]);

        const isPlaceholder = fileText === fallback;

        return (
            <StyledFileText
                data-placeholder={isPlaceholder || undefined}
                ref={ref}
                {...rest}
            >
                {children || fileText}
            </StyledFileText>
        );
    }
);

// ─── Context ─────────────────────────────────────────────────────────────────

/**
 * FileUpload.Context
 *
 * Render prop component to access the file upload context.
 */
export function Context(props: { children: (ctx: UseFileUploadReturn) => React.ReactNode }) {
    const ctx = useFileUploadContext();
    return <>{props.children(ctx)}</>;
}

// ─── Shortcut Components ─────────────────────────────────────────────────────

interface ItemsBaseProps {
    showSize?: boolean;
    clearable?: boolean;
}

/**
 * FileUpload.Items
 *
 * Shortcut component that renders all accepted files as items.
 */
export function Items(props: ItemsBaseProps & HTMLDreamyProps<"li">) {
    const { showSize, clearable, ...rest } = props;
    const ctx = useFileUploadContext();

    return (
        <>
            {ctx.acceptedFiles.map((file) => (
                <Item
                    file={file}
                    key={file.name}
                    {...rest}
                >
                    <ItemPreview />
                    {showSize ? (
                        <ItemContent>
                            <ItemName file={file} />
                            <ItemSizeText file={file} />
                        </ItemContent>
                    ) : (
                        <ItemName
                            file={file}
                            flex="1"
                        />
                    )}
                    {clearable && <ItemDeleteTrigger file={file} />}
                </Item>
            ))}
        </>
    );
}

interface ListProps extends ItemsBaseProps {}

/**
 * FileUpload.List
 *
 * Shortcut that renders an item group with all accepted files.
 * Equivalent to `<FileUpload.ItemGroup><FileUpload.Items /></FileUpload.ItemGroup>`.
 */
export const List = forwardRef<HTMLUListElement, ListProps & HTMLDreamyProps<"ul">>(
    function FileUploadList(props, ref) {
        const { showSize, clearable, ...rest } = props;
        const ctx = useFileUploadContext();

        if (ctx.acceptedFiles.length === 0) return null;

        return (
            <ItemGroup
                ref={ref}
                {...rest}
            >
                <Items
                    clearable={clearable}
                    showSize={showSize}
                />
            </ItemGroup>
        );
    }
);

// ─── Default Icons ───────────────────────────────────────────────────────────

function DefaultFileIcon() {
    return (
        <svg
            aria-hidden="true"
            fill="none"
            height="18"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            viewBox="0 0 24 24"
            width="18"
            xmlns="http://www.w3.org/2000/svg"
        >
            <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" />
            <path d="M14 2v4a2 2 0 0 0 2 2h4" />
        </svg>
    );
}

function DefaultCloseIcon() {
    return (
        <svg
            aria-hidden="true"
            fill="none"
            height="14"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            viewBox="0 0 24 24"
            width="14"
            xmlns="http://www.w3.org/2000/svg"
        >
            <path d="M18 6 6 18" />
            <path d="m6 6 12 12" />
        </svg>
    );
}
