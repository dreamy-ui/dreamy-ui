"use client";

import {
    type DreamyHostProps,
    dataAttr,
    useFieldProps
} from "@dreamy-ui/react";
import {
    FileInput as UiSdkFileInput,
    FileInputDropzone as UiSdkFileInputDropzone,
    FileInputItem as UiSdkFileInputItem,
    FileInputItemRemove as UiSdkFileInputItemRemove,
    FileInputList as UiSdkFileInputList,
    FileInputTrigger as UiSdkFileInputTrigger,
    type FileInputController,
    type FileInputDropzoneProps,
    type FileInputOptions,
    createFileInputController,
    formatFileSize
} from "@ui-sdk/react/file-input";
import type React from "react";
import {
    type CSSProperties,
    type ReactElement,
    type ReactNode,
    createContext,
    useContext,
    useEffect,
    useMemo,
    useState
} from "react";
import { css, cx } from "styled-system/css";
import {
    type HTMLDreamyProps,
    createStyleContext,
    dreamy,
    splitCssProps
} from "styled-system/jsx";
import { fileUpload } from "styled-system/recipes";

const { withProvider, withContext } = createStyleContext(fileUpload);

export { createFileInputController, formatFileSize };

export interface FileUploadUiState {
    files: readonly File[];
    disabled: boolean;
    required: boolean;
    dragging: boolean;
    invalid: boolean;
    controller: FileInputController;
    fieldId?: string;
    ariaDescribedBy?: string;
}

const FileUploadUiContext = createContext<FileUploadUiState | null>(null);

export function useFileUploadUi(): FileUploadUiState {
    const ctx = useContext(FileUploadUiContext);
    if (!ctx) {
        throw new Error("FileUpload sub-components must be used within FileUpload.Root");
    }
    return ctx;
}

// ─── Root ────────────────────────────────────────────────────────────────────

export interface FileUploadRootProps
    extends FileInputOptions,
        DreamyHostProps<HTMLDreamyProps<"div">, FileInputOptions, "onChange" | "onSelect" | "onDrop"> {
    invalid?: boolean;
    children?: ReactNode;
}

/**
 * File Upload component — drag-and-drop and picker-based file selection powered by UI SDK.
 *
 * @see Docs https://dreamy-ui.com/docs/components/file-upload
 */
export const Root = withProvider(function FileUploadRoot(props: FileUploadRootProps) {
    const {
        accept,
        maxFiles,
        maxSize,
        minSize,
        multiple,
        directory,
        capture,
        disabled,
        required,
        invalid,
        name,
        form,
        value,
        defaultValue,
        onValueChange,
        onReject,
        validate,
        announcement,
        controller: controllerProp,
        debug,
        id,
        className,
        style,
        children,
        ...rest
    } = props;

    const [internalController] = useState(createFileInputController);
    const resolvedController = controllerProp ?? internalController;

    const {
        isDisabled: isDisabledField = false,
        isRequired: isRequiredField = false,
        isInvalid: isInvalidField = false,
        id: fieldId,
        "aria-describedby": ariaDescribedBy
    } = useFieldProps({
        isDisabled: disabled,
        isRequired: required,
        isInvalid: invalid,
        id
    });

    const resolvedDisabled = disabled ?? isDisabledField;
    const resolvedRequired = required ?? isRequiredField;
    const resolvedInvalid = invalid ?? isInvalidField;
    const resolvedMultiple = multiple ?? (maxFiles !== undefined && maxFiles > 1 ? true : undefined);

    const [cssProps, domProps] = splitCssProps(rest);
    const mergedClassName = cx(className as string | undefined, css(cssProps));

    return (
        <UiSdkFileInput
            {...(domProps as unknown as React.ComponentProps<typeof UiSdkFileInput>)}
            accept={accept}
            announcement={announcement}
            capture={capture}
            className={mergedClassName}
            controller={resolvedController}
            data-invalid={dataAttr(resolvedInvalid)}
            debug={debug}
            defaultValue={defaultValue}
            directory={directory}
            disabled={resolvedDisabled}
            form={form}
            maxFiles={maxFiles}
            maxSize={maxSize}
            minSize={minSize}
            multiple={resolvedMultiple}
            name={name}
            onReject={onReject}
            onValueChange={onValueChange}
            required={resolvedRequired}
            style={style as CSSProperties | undefined}
            validate={validate}
            value={value}
        >
            {(state) => (
                <FileUploadUiContext.Provider
                    value={{
                        files: state.value,
                        disabled: state.disabled,
                        required: state.required,
                        dragging: state.dragging,
                        invalid: resolvedInvalid,
                        controller: resolvedController,
                        fieldId,
                        ariaDescribedBy
                    }}
                >
                    {children}
                </FileUploadUiContext.Provider>
            )}
        </UiSdkFileInput>
    );
}, "root");

// ─── Label ───────────────────────────────────────────────────────────────────

export interface FileUploadLabelProps extends HTMLDreamyProps<"label"> {}

/**
 * File Upload Label — accessible label for the file input trigger.
 */
export const Label = withContext(function FileUploadLabel(props: FileUploadLabelProps) {
    const ui = useFileUploadUi();
    return (
        <dreamy.label
            htmlFor={ui.fieldId}
            {...props}
        />
    );
}, "label");

// ─── Dropzone ────────────────────────────────────────────────────────────────

export interface FileUploadDropzoneProps
    extends FileInputDropzoneProps,
        Omit<HTMLDreamyProps<"div">, "children"> {
    children?: ReactNode;
}

/**
 * File Upload Dropzone — drag-and-drop and paste area for uploading files.
 */
export const Dropzone = withContext(function FileUploadDropzone(props: FileUploadDropzoneProps) {
    const { target, pasteTarget, className, style, children, ...rest } = props;
    const [cssProps, domProps] = splitCssProps(rest);

    return (
        <UiSdkFileInputDropzone
            {...(domProps as unknown as React.ComponentProps<typeof UiSdkFileInputDropzone>)}
            className={cx(className as string | undefined, css(cssProps))}
            pasteTarget={pasteTarget}
            style={style as CSSProperties | undefined}
            target={target}
        >
            {children}
        </UiSdkFileInputDropzone>
    );
}, "dropzone");

// ─── DropzoneContent ─────────────────────────────────────────────────────────

/**
 * File Upload Dropzone Content — inner content area of the dropzone.
 */
export const DropzoneContent = withContext(dreamy.div, "dropzoneContent");

// ─── Trigger ─────────────────────────────────────────────────────────────────

export interface FileUploadTriggerProps
    extends Omit<HTMLDreamyProps<"button">, "children" | "name" | "form" | "value" | "asChild"> {
    controller?: FileInputController;
    render?: ReactElement;
    children?: ReactNode;
}

/**
 * File Upload Trigger — button that opens the file picker dialog.
 */
export const Trigger = withContext(function FileUploadTrigger(props: FileUploadTriggerProps) {
    const { controller, render, className, style, children, id, ...rest } = props;
    const ui = useFileUploadUi();
    const [cssProps, domProps] = splitCssProps(rest);

    return (
        <UiSdkFileInputTrigger
            {...(domProps as unknown as React.ComponentProps<typeof UiSdkFileInputTrigger>)}
            aria-invalid={ui.invalid || undefined}
            className={cx(className as string | undefined, css(cssProps))}
            controller={controller}
            id={id ?? ui.fieldId}
            render={render}
            style={style as CSSProperties | undefined}
        >
            {children}
        </UiSdkFileInputTrigger>
    );
}, "trigger");

// ─── ItemGroup ───────────────────────────────────────────────────────────────

/**
 * File Upload Item Group — list container for uploaded files.
 */
export const ItemGroup = withContext(dreamy.ul, "itemGroup");

// ─── Item ────────────────────────────────────────────────────────────────────

export interface FileUploadItemProps extends Omit<HTMLDreamyProps<"li">, "children"> {
    file?: File;
    children?: ReactNode | ((state: { file: File }) => ReactNode);
}

/**
 * File Upload Item — single uploaded file in the list.
 */
export const Item = withContext(function FileUploadItem(props: FileUploadItemProps) {
    const { file, className, style, children, ...rest } = props;
    const [cssProps, domProps] = splitCssProps(rest);

    return (
        <UiSdkFileInputItem
            {...(domProps as unknown as React.ComponentProps<typeof UiSdkFileInputItem>)}
            className={cx(className as string | undefined, css(cssProps))}
            data-file={file?.name}
            file={file}
            render={<li />}
            style={style as CSSProperties | undefined}
        >
            {children}
        </UiSdkFileInputItem>
    );
}, "item");

// ─── ItemPreview ─────────────────────────────────────────────────────────────

export interface FileUploadItemPreviewProps extends HTMLDreamyProps<"div"> {
    file?: File;
}

const StyledItemPreview = withContext(dreamy.div, "itemPreview");

/**
 * File Upload Item Preview — preview icon or content for an uploaded file.
 */
export function ItemPreview(props: FileUploadItemPreviewProps) {
    const { file: _file, children, ...rest } = props;

    return <StyledItemPreview {...rest}>{children || <DefaultFileIcon />}</StyledItemPreview>;
}

// ─── ItemPreviewImage ────────────────────────────────────────────────────────

export interface FileUploadItemPreviewImageProps extends HTMLDreamyProps<"img"> {
    file: File;
}

const StyledItemPreviewImage = withContext(dreamy.img, "itemPreviewImage");

/**
 * File Upload Item Preview Image — image preview for uploaded image files.
 */
export function ItemPreviewImage(props: FileUploadItemPreviewImageProps) {
    const { file, ...rest } = props;
    const [src, setSrc] = useState<string>("");

    useEffect(() => {
        const url = URL.createObjectURL(file);
        setSrc(url);
        return () => {
            URL.revokeObjectURL(url);
        };
    }, [file]);

    if (!src) return null;

    return (
        <StyledItemPreviewImage
            alt={file.name}
            src={src}
            {...rest}
        />
    );
}

// ─── ItemContent ─────────────────────────────────────────────────────────────

/**
 * File Upload Item Content — groups file name, size, and actions.
 */
export const ItemContent = withContext(dreamy.div, "itemContent");

// ─── ItemName ────────────────────────────────────────────────────────────────

export interface FileUploadItemNameProps extends HTMLDreamyProps<"span"> {
    file: File;
}

const StyledItemName = withContext(dreamy.span, "itemName");

/**
 * File Upload Item Name — displays the uploaded file name.
 */
export function ItemName(props: FileUploadItemNameProps) {
    const { file, children, ...rest } = props;

    return <StyledItemName {...rest}>{children || file.name}</StyledItemName>;
}

// ─── ItemSizeText ────────────────────────────────────────────────────────────

export interface FileUploadItemSizeTextProps extends HTMLDreamyProps<"span"> {
    file: File;
}

const StyledItemSizeText = withContext(dreamy.span, "itemSizeText");

/**
 * File Upload Item Size Text — human-readable file size display.
 */
export function ItemSizeText(props: FileUploadItemSizeTextProps) {
    const { file, children, ...rest } = props;
    const sizeText = useMemo(() => formatFileSize(file.size), [file.size]);

    return <StyledItemSizeText {...rest}>{children || sizeText}</StyledItemSizeText>;
}

// ─── ItemDeleteTrigger ───────────────────────────────────────────────────────

export interface FileUploadItemDeleteTriggerProps
    extends Omit<HTMLDreamyProps<"button">, "children" | "name" | "form" | "value"> {
    file?: File;
    children?: ReactNode;
}

/**
 * File Upload Item Delete Trigger — removes a specific file from the list.
 */
export const ItemDeleteTrigger = withContext(function FileUploadItemDeleteTrigger(
    props: FileUploadItemDeleteTriggerProps
) {
    const { file, className, style, children, ...rest } = props;
    const [cssProps, domProps] = splitCssProps(rest);

    return (
        <UiSdkFileInputItemRemove
            {...(domProps as unknown as React.ComponentProps<typeof UiSdkFileInputItemRemove>)}
            className={cx(className as string | undefined, css(cssProps))}
            file={file}
            style={style as CSSProperties | undefined}
        >
            {children || <DefaultCloseIcon />}
        </UiSdkFileInputItemRemove>
    );
}, "itemDeleteTrigger");

// ─── ClearTrigger ────────────────────────────────────────────────────────────

const StyledClearTrigger = withContext(dreamy.button, "itemDeleteTrigger");

/**
 * File Upload Clear Trigger — removes all accepted files.
 */
export function ClearTrigger(props: HTMLDreamyProps<"button">) {
    const { children, onClick, disabled, ...rest } = props;
    const ui = useFileUploadUi();

    return (
        <StyledClearTrigger
            aria-label="Clear all files"
            disabled={disabled ?? ui.disabled}
            onClick={(event) => {
                (onClick as React.MouseEventHandler<HTMLButtonElement> | undefined)?.(event);
                ui.controller.clear();
            }}
            type="button"
            {...rest}
        >
            {children}
        </StyledClearTrigger>
    );
}

// ─── FileText ────────────────────────────────────────────────────────────────

export interface FileUploadFileTextProps extends HTMLDreamyProps<"span"> {
    fallback?: string;
}

const StyledFileText = withContext(dreamy.span, "fileText");

/**
 * File Upload File Text — selected file name or placeholder text.
 */
export function FileText(props: FileUploadFileTextProps) {
    const { fallback = "Select file(s)", children, ...rest } = props;
    const ui = useFileUploadUi();

    const fileText = useMemo(() => {
        const files = ui.files;
        if (files.length === 1) return files[0].name;
        if (files.length > 1) return `${files.length} files`;
        return fallback;
    }, [ui.files, fallback]);

    const isPlaceholder = fileText === fallback;

    return (
        <StyledFileText
            data-placeholder={dataAttr(isPlaceholder)}
            {...rest}
        >
            {children || fileText}
        </StyledFileText>
    );
}

// ─── Context ─────────────────────────────────────────────────────────────────

/**
 * File Upload Context — render-prop access to file upload state and controller.
 */
export function Context(props: { children: (ctx: FileUploadUiState) => ReactNode }) {
    const ctx = useFileUploadUi();
    return <>{props.children(ctx)}</>;
}

// ─── Shortcut Components ─────────────────────────────────────────────────────

export interface FileUploadItemsProps extends Omit<FileUploadItemProps, "file"> {
    showSize?: boolean;
    clearable?: boolean;
}

/**
 * File Upload Items — shortcut that renders all accepted files as items.
 */
export function Items(props: FileUploadItemsProps) {
    const { showSize, clearable, ...rest } = props;
    const ui = useFileUploadUi();

    return (
        <>
            {ui.files.map((file, index) => (
                <Item
                    file={file}
                    key={`${file.name}-${file.size}-${index}`}
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
                            data-grow={dataAttr(true)}
                            file={file}
                        />
                    )}
                    {clearable ? <ItemDeleteTrigger file={file} /> : null}
                </Item>
            ))}
        </>
    );
}

export interface FileUploadListProps extends Omit<HTMLDreamyProps<"ul">, "children"> {
    showSize?: boolean;
    clearable?: boolean;
}

/**
 * File Upload List — UI SDK file list containing all accepted files.
 */
export const List = withContext(function FileUploadList(props: FileUploadListProps) {
    const { showSize, clearable, className, style, ...rest } = props;
    const ui = useFileUploadUi();
    const [cssProps, domProps] = splitCssProps(rest);

    if (ui.files.length === 0) return null;

    return (
        <UiSdkFileInputList
            {...(domProps as unknown as React.ComponentProps<typeof UiSdkFileInputList>)}
            className={cx(className as string | undefined, css(cssProps))}
            render={<ul />}
            style={style as CSSProperties | undefined}
        >
            <Item>
                {(state) => (
                    <>
                        <ItemPreview />
                        {showSize ? (
                            <ItemContent>
                                <ItemName file={state.file} />
                                <ItemSizeText file={state.file} />
                            </ItemContent>
                        ) : (
                            <ItemName
                                data-grow={dataAttr(true)}
                                file={state.file}
                            />
                        )}
                        {clearable ? <ItemDeleteTrigger file={state.file} /> : null}
                    </>
                )}
            </Item>
        </UiSdkFileInputList>
    );
}, "itemGroup");

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
