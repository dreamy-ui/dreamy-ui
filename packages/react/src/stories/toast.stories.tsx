import { Button, useToast } from "@/components";
import type { Meta } from "@storybook/react";

export default {
	title: "Toast"
} satisfies Meta;

export function Base() {
	const { toast } = useToast();

	return (
		<Button
			onClick={() =>
				toast({
					title: "Welcome!",
					description: "Make yourself at home!"
				})
			}
		>
			Toast
		</Button>
	);
}

export function Status() {
	const { toast } = useToast();

	return (
		<>
			{(["success", "error", "warning", "info", "loading"] as const).map(
				(status) => (
					<Button
						key={status}
						onClick={() =>
							toast({
								title: status + "!",
								description: `This is a ${status} toast!`,
								status
							})
						}
					>
						{status}
					</Button>
				)
			)}
		</>
	);
}
