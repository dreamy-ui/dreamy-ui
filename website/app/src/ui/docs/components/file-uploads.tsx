import { Button, FileUpload, Flex, Image } from "@/ui";
import { useFileUploadContext } from "@dreamy-ui/react";

function CustomImageList() {
    const fileUpload = useFileUploadContext();
    const files = fileUpload.acceptedFiles;
    if (files.length === 0) return null;

    return (
        <FileUpload.ItemGroup>
            {files.map((file) => (
                <FileUpload.Item
                    bg={"transparent"}
                    boxSize="20"
                    file={file}
                    key={file.name}
                    overflow="hidden"
                    p="2"
                    position="relative"
                    w="auto"
                >
                    <Image
                        absolute
                        alt={file.name}
                        filter={"brightness(0.4)"}
                        h="full"
                        objectFit="cover"
                        right={0}
                        src={URL.createObjectURL(file)}
                        top={0}
                        w="full"
                        zIndex={-1}
                    />
                    <FileUpload.ItemPreviewImage file={file} />
                    <Flex
                        position="absolute"
                        right="1"
                        top="1"
                    >
                        <FileUpload.ItemDeleteTrigger
                            boxSize="5"
                            file={file}
                            rounded="full"
                        />
                    </Flex>
                </FileUpload.Item>
            ))}
        </FileUpload.ItemGroup>
    );
}

export function FileUploadCustomList() {
    return (
        <FileUpload.Root
            accept={["image/*"]}
            maxFiles={5}
            maxW="sm"
        >
            <FileUpload.Trigger asChild>
                <Button variant="outline">Upload Images</Button>
            </FileUpload.Trigger>
            <CustomImageList />
        </FileUpload.Root>
    );
}
