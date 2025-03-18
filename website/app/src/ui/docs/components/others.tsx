import { Button } from "@dreamy-ui/react";

export function LinkButton() {
	return (
		<Button asComp={<a href="https://google.com" />}>
			<>Google</>
		</Button>
	);
}
