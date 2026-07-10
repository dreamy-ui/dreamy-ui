import { Icon, IconButton, Snippet } from "@/ui";
import { useSnippetContext } from "@dreamy-ui/react";
import { LuCheck, LuCopy, LuLink } from "react-icons/lu";

export { PackageManagerSnippet } from "./package-manager-snippet";

function CustomCopyButton() {
    const { copy, copied } = useSnippetContext();

    return (
        <IconButton
            aria-label="Copy with custom button"
            color={"fg.medium"}
            icon={
                <Icon
                    as={copied ? LuCheck : LuCopy}
                    boxSize={"4"}
                />
            }
            onClick={() => copy()}
            p={2}
            variant={"link"}
        />
    );
}

export function CustomCopySnippet() {
    return (
        <Snippet.Root w="full">
            <Snippet.Header
                hideCopyButton
                icon={LuLink}
            >
                <CustomCopyButton />
            </Snippet.Header>
            <Snippet.Body>pnpm dlx dreamy add --all</Snippet.Body>
        </Snippet.Root>
    );
}
