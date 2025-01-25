import { Button } from "@dreamy-ui/react";

import { useToast } from "@dreamy-ui/react";
import { HStack } from "@dreamy-ui/react/rsc";
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
