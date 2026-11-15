import { Button } from "@/ui";
import { useEffect, useRef, useState } from "react";

type SaveStatus = "idle" | "loading" | "success";

export function SuccessFlowButton() {
    const [status, setStatus] = useState<SaveStatus>("idle");
    const timeoutRef = useRef<ReturnType<typeof setTimeout>>(undefined);

    useEffect(() => () => clearTimeout(timeoutRef.current), []);

    function handleClick() {
        clearTimeout(timeoutRef.current);
        setStatus("loading");
        timeoutRef.current = setTimeout(() => {
            setStatus("success");
            timeoutRef.current = setTimeout(() => setStatus("idle"), 2000);
        }, 1200);
    }

    return (
        <Button
            isLoading={status === "loading"}
            isSuccess={status === "success"}
            loadingText="Saving"
            onClick={handleClick}
            successText="Saved"
            variant="primary"
            w="fit-content"
        >
            Save changes
        </Button>
    );
}
