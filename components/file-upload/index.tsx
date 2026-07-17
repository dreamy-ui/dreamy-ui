"use client";

import {
    FileUploadProvider,
    type UseFileUploadProps,
    type UseFileUploadReturn,
    dataAttr,
    formatFileSize,
    useFileUpload,
    useFileUploadContext
} from "@dreamy-ui/react";
import { useMemo } from "react";
import { type HTMLDreamyProps, createStyleContext, dreamy } from "styled-system/jsx";
import { fileUpload } from "styled-system/recipes";

const { withProvider, withContext } = createStyleContext(fileUpload);

// ─── Root ────────────────────────────────────────────────────────────────────

interface RootBaseProps extends UseFileUploadProps {}

const StyledRoot = withProvider(dreamy.div, "root");

/**
 * File Upload component — drag-and-drop and picker-based file selection.
 *
 * @see Docs https://dreamy-ui.com/docs/components/file-upload
 *
 * @example
 * ```tsx
 * <FileUpload.Root accept="image/*" maxFiles={3}>
 *   <FileUpload.Dropzone>
 *     <FileUpload.Trigger>Choose files</FileUpload.Trigger>
 *   </FileUpload.Dropzone>
 *   <FileUpload.List />
 * </FileUpload.Root>
 * ```
 */
export function Root(props: RootBaseProps & HTMLDreamyProps<"div">) {
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
                {...fileUpload.getRootProps()}
                {...rest}
            >
                <input {...fileUpload.getInputProps()} />
                {children}
            </StyledRoot>
        </FileUploadProvider>
    );
}

// ─── RootProvider ────────────────────────────────────────────────────────────

interface RootProviderProps {
    value: UseFileUploadReturn;
    children?: React.ReactNode;
}

const StyledRootProvider = withProvider(dreamy.div, "root");

/**
 * File Upload Root Provider — root wrapper when using `useFileUpload` externally.
 */
export function RootProvider(props: RootProviderProps & HTMLDreamyProps<"div">) {
    const { value, children, ...rest } = props;

    return (
        <FileUploadProvider value={value}>
            <StyledRootProvider
                {...value.getRootProps()}
                {...rest}
            >
                <input {...value.getInputProps()} />
                {children}
            </StyledRootProvider>
        </FileUploadProvider>
    );
}

// ─── Label ───────────────────────────────────────────────────────────────────

/**
 * File Upload Label — accessible label for the file input.
 */
export const Label = withContext(dreamy.label, "label");

// ─── Dropzone ────────────────────────────────────────────────────────────────

const StyledDropzone = withContext(dreamy.div, "dropzone");

/**
 * File Upload Dropzone — drag-and-drop area for uploading files.
 */
export function Dropzone(props: HTMLDreamyProps<"div">) {
    const { children, ...rest } = props;
    const ctx = useFileUploadContext();

    return (
        <StyledDropzone
            {...ctx.getDropzoneProps()}
            {...rest}
        >
            {children}
        </StyledDropzone>
    );
}

// ─── DropzoneContent ─────────────────────────────────────────────────────────

/**
 * File Upload Dropzone Content — inner content area of the dropzone.
 */
export const DropzoneContent = withContext(dreamy.div, "dropzoneContent");

// ─── Trigger ─────────────────────────────────────────────────────────────────

const StyledTrigger = withContext(dreamy.button, "trigger");

/**
 * File Upload Trigger — button that opens the file picker dialog.
 */
export function Trigger(props: HTMLDreamyProps<"button">) {
    const { children, ...rest } = props;
    const ctx = useFileUploadContext();

    return (
        <StyledTrigger
            {...ctx.getTriggerProps()}
            {...rest}
        >
            {children}
        </StyledTrigger>
    );
}

// ─── ItemGroup ───────────────────────────────────────────────────────────────

/**
 * File Upload Item Group — list container for uploaded files.
 */
export const ItemGroup = withContext(dreamy.ul, "itemGroup");

// ─── Item ────────────────────────────────────────────────────────────────────

interface ItemProps {
    file: File;
    children?: React.ReactNode;
}

const StyledItem = withContext(dreamy.li, "item");

/**
 * File Upload Item — single uploaded file in the list.
 */
export function Item(props: ItemProps & HTMLDreamyProps<"li">) {
    const { file, children, ...rest } = props;

    return (
        <StyledItem
            data-file={file.name}
            {...rest}
        >
            {children}
        </StyledItem>
    );
}

// ─── ItemPreview ─────────────────────────────────────────────────────────────

interface ItemPreviewProps {
    file?: File;
    children?: React.ReactNode;
}

const StyledItemPreview = withContext(dreamy.div, "itemPreview");

/**
 * File Upload Item Preview — preview icon or content for an uploaded file.
 */
export function ItemPreview(props: ItemPreviewProps & HTMLDreamyProps<"div">) {
    const { children, ...rest } = props;

    return <StyledItemPreview {...rest}>{children || <DefaultFileIcon />}</StyledItemPreview>;
}

// ─── ItemPreviewImage ────────────────────────────────────────────────────────

interface ItemPreviewImageProps {
    file: File;
}

const StyledItemPreviewImage = withContext(dreamy.img, "itemPreviewImage");

/**
 * File Upload Item Preview Image — image preview for uploaded image files.
 */
export function ItemPreviewImage(props: ItemPreviewImageProps & HTMLDreamyProps<"img">) {
    const { file, ...rest } = props;
    const src = useMemo(() => URL.createObjectURL(file), [file]);

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

interface ItemNameProps {
    file: File;
    children?: React.ReactNode;
}

const StyledItemName = withContext(dreamy.span, "itemName");

/**
 * File Upload Item Name — displays the uploaded file name.
 */
export function ItemName(props: ItemNameProps & HTMLDreamyProps<"span">) {
    const { file, children, ...rest } = props;

    return <StyledItemName {...rest}>{children || file.name}</StyledItemName>;
}

// ─── ItemSizeText ────────────────────────────────────────────────────────────

interface ItemSizeTextProps {
    file: File;
    children?: React.ReactNode;
}

const StyledItemSizeText = withContext(dreamy.span, "itemSizeText");

/**
 * File Upload Item Size Text — human-readable file size display.
 */
export function ItemSizeText(props: ItemSizeTextProps & HTMLDreamyProps<"span">) {
    const { file, children, ...rest } = props;
    const ctx = useFileUploadContext();
    const sizeText = useMemo(() => formatFileSize(file.size, ctx.locale), [file.size, ctx.locale]);

    return <StyledItemSizeText {...rest}>{children || sizeText}</StyledItemSizeText>;
}

// ─── ItemDeleteTrigger ───────────────────────────────────────────────────────

interface ItemDeleteTriggerProps {
    file: File;
    children?: React.ReactNode;
}

const StyledItemDeleteTrigger = withContext(dreamy.button, "itemDeleteTrigger");

/**
 * File Upload Item Delete Trigger — removes a specific file from the list.
 */
export function ItemDeleteTrigger(props: ItemDeleteTriggerProps & HTMLDreamyProps<"button">) {
    const { file, children, ...rest } = props;
    const ctx = useFileUploadContext();

    return (
        <StyledItemDeleteTrigger
            aria-label={`Remove ${file.name}`}
            onClick={() => ctx.removeFile(file)}
            type="button"
            {...rest}
        >
            {children || <DefaultCloseIcon />}
        </StyledItemDeleteTrigger>
    );
}

// ─── ClearTrigger ────────────────────────────────────────────────────────────

const StyledClearTrigger = withContext(dreamy.button, "itemDeleteTrigger");

/**
 * File Upload Clear Trigger — removes all accepted files.
 */
export function ClearTrigger(props: HTMLDreamyProps<"button">) {
    const { children, ...rest } = props;
    const ctx = useFileUploadContext();

    return (
        <StyledClearTrigger
            aria-label="Clear all files"
            onClick={() => ctx.clearFiles()}
            type="button"
            {...rest}
        >
            {children}
        </StyledClearTrigger>
    );
}

// ─── FileText ────────────────────────────────────────────────────────────────

interface FileTextProps {
    fallback?: string;
    children?: React.ReactNode;
}

const StyledFileText = withContext(dreamy.span, "fileText");

/**
 * File Upload File Text — selected file name or placeholder text.
 */
export function FileText(props: FileTextProps & HTMLDreamyProps<"span">) {
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
            {...rest}
        >
            {children || fileText}
        </StyledFileText>
    );
}

// ─── Context ─────────────────────────────────────────────────────────────────

/**
 * File Upload Context — render-prop access to file upload state.
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
 * File Upload Items — shortcut that renders all accepted files as items.
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
                            data-grow={dataAttr(true)}
                            file={file}
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
 * File Upload List — item group containing all accepted files.
 */
export function List(props: ListProps & HTMLDreamyProps<"ul">) {
    const { showSize, clearable, ...rest } = props;
    const ctx = useFileUploadContext();

    if (ctx.acceptedFiles.length === 0) return null;

    return (
        <ItemGroup {...rest}>
            <Items
                clearable={clearable}
                showSize={showSize}
            />
        </ItemGroup>
    );
}

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
