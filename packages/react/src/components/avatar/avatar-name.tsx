import type { AvatarOptions } from "@/components/avatar/avatar-types";
import { Box } from "@/components/box/box";
import type { HTMLDreamProps } from "@/utils/types";

export function initials(name: string) {
	const names = name.trim().split(" ");
	const firstName = names[0] ?? "";
	const lastName = names.length > 1 ? names[names.length - 1] : "";
	return firstName && lastName
		? `${firstName.charAt(0)}${lastName.charAt(0)}`
		: firstName.charAt(0);
}

interface AvatarNameProps
	extends HTMLDreamProps<"div">,
		Pick<AvatarOptions, "name" | "getInitials"> {}

/**
 * The avatar name container
 */
export function AvatarName(props: AvatarNameProps) {
	const { name, getInitials, ...rest } = props;

	return (
		<Box role="img" aria-label={name} data-part="name" {...rest}>
			{name ? getInitials?.(name) : null}
		</Box>
	);
}
