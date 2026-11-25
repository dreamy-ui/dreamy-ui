import { Button, FileUpload, Text } from "@/ui";
import type { Meta } from "@storybook/react-vite";

export default {
    title: "File Upload"
} satisfies Meta;

export function Basic() {
    return (
        <FileUpload.Root maxW="sm">
            <FileUpload.Trigger render={<Button variant="outline" />}>
                Upload file
            </FileUpload.Trigger>
            <FileUpload.List
                clearable
                showSize
            />
        </FileUpload.Root>
    );
}

export function Dropzone() {
    return (
        <FileUpload.Root
            alignItems="stretch"
            maxFiles={5}
            maxW="xl"
            multiple
        >
            <FileUpload.Dropzone>
                <FileUpload.DropzoneContent>
                    <Text>Drag and drop files here</Text>
                    <Text
                        color="fg.medium"
                        fontSize="sm"
                    >
                        .png, .jpg up to 5MB
                    </Text>
                </FileUpload.DropzoneContent>
                <FileUpload.Trigger render={<Button variant="outline" />}>
                    Browse files
                </FileUpload.Trigger>
            </FileUpload.Dropzone>
            <FileUpload.List
                clearable
                showSize
            />
        </FileUpload.Root>
    );
}
