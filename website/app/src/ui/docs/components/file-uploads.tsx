import { Button, FileUpload, Flex } from "@/ui";

function CustomImageList() {
    return (
        <FileUpload.Context>
            {({ files }) => {
                if (files.length === 0) return null;

                return (
                    <FileUpload.ItemGroup>
                        {files.map((file, index) => (
                            <FileUpload.Item
                                bg="transparent"
                                boxSize="20"
                                file={file}
                                key={`${file.name}-${index}`}
                                overflow="hidden"
                                p="2"
                                position="relative"
                                w="auto"
                            >
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
            }}
        </FileUpload.Context>
    );
}

export function FileUploadCustomList() {
    return (
        <FileUpload.Root
            accept={["image/*"]}
            maxFiles={5}
            maxW="sm"
            multiple
        >
            <FileUpload.Trigger render={<Button variant="outline" />}>
                Upload Images
            </FileUpload.Trigger>
            <CustomImageList />
        </FileUpload.Root>
    );
}
