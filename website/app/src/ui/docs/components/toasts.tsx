import { Button } from "@/button";
import { HStack } from "@/stack";
import { useToast } from "@/toast-provider";
import { useState } from "react";

export function UpdateToast() {
    const { toast, updateToast } = useToast();
    const [toastId, setToastId] = useState<string | null>(null);

    return (
        <HStack>
            <Button
                onClick={() => {
                    setToastId(
                        toast({
                            title: "Loading",
                            description: "Please wait till file is uploaded!",
                            status: "loading",
                            duration: Number.POSITIVE_INFINITY
                        })
                    );
                }}
            >
                Send Toast
            </Button>
            <Button
                onClick={() => {
                    if (toastId) {
                        updateToast(toastId, {
                            title: "Success!",
                            description: "File uploaded successfully!",
                            status: "success"
                        });
                    }
                }}
            >
                Update Toast
            </Button>
        </HStack>
    );
}
