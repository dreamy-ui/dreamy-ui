import { Button } from "@/ui";

export function LinkButton() {
    return (
        <Button as={<a href="https://google.com" />}>
            <>Google</>
        </Button>
    );
}
