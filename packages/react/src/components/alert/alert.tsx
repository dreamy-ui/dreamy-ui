import { Icon, Text } from "@/rsc";
import type { HTMLDreamProps, Status } from "@/utils/types";
import { type AlertVariantProps, alert } from "@dreamy-ui/system/recipes";
import { forwardRef } from "react";
import { dreamy } from "../factory";
import { useStatusIcon } from "./status-icon";

export interface AlertProps
	extends Omit<HTMLDreamProps<"div">, "title">,
		AlertVariantProps {
	/**
	 * The status of the alert.
	 * @default "info"
	 */
	status?: Status;
	/**
	 * The title of the alert.
	 */
	title?: React.ReactNode;
	/**
	 * The description of the alert.
	 */
	description?: React.ReactNode;
	/**
	 * Custom alert icon
	 */
	icon?: React.ReactNode;
}

const StyledAlert = dreamy("div", alert);

/**
 * Alert component
 *
 * @See Docs https://dreamy-ui.com/docs/components/alert
 */
export const Alert = forwardRef<HTMLDivElement, AlertProps>(function Alert(
	props,
	ref
) {
	const { status = "info", title, description, ...rest } = props;

	const statusIcon = useStatusIcon(status);

	return (
		<StyledAlert data-status={status} {...rest} ref={ref}>
			<Text data-part={"title"} as={"h4"}>
				<Icon
					fill={"currentColor"}
					color={"currentColor"}
					stroke={"currentColor"}
					role="img"
					data-part={"icon"}
					asChild
				>
					{statusIcon}
				</Icon>
				{title}
			</Text>
			<Text data-part={"description"}>{description}</Text>
		</StyledAlert>
	);
});
