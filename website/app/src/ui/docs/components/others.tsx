import { Button } from "@/button";

export function LinkButton() {
    return (
        <Button asComp={<a href="https://google.com" />}>
            <>Google</>
        </Button>
    );
}
