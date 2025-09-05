import { Box } from "@/box";
import { Button } from "@/button";
import { Flex } from "@/flex";
import { Icon } from "@/icon";
import { IconButton } from "@/icon-button";
import { DarkTheme } from "@/theme";
import { useClipboard } from "@dreamy-ui/react";
import { Children, type ReactNode, isValidElement, useMemo, useState } from "react";
import { FaTerminal } from "react-icons/fa";
import { LuCheck, LuCopy } from "react-icons/lu";
import { type PM, useGlobalContext } from "../../global/GlobalContext";

export interface PMTabsOptionProps {
	name: "npm" | "pnpm" | "yarn" | "bun" | (string & {});
	children: ReactNode;
}

function Option(_props: PMTabsOptionProps) {
	return null;
}

export const PMTabs = Object.assign(
	function PMTabs({ children }: { children: ReactNode }) {
		const { pm, updatePm } = useGlobalContext();

		const options = useMemo(() => {
			return Children.toArray(children)
				.map((child) => {
					if (!isValidElement(child)) return null;
					const name = child.props?.name as PMTabsOptionProps["name"] | undefined;
					if (!name) return null;
					const content = child.props?.children as ReactNode;
					return { name, content };
				})
				.filter(Boolean) as Array<{ name: string; content: ReactNode }>;
		}, [children]);

		const [active, setActive] = useState<string>(() => {
			const order = ["npm", "pnpm", "yarn", "bun"];
			if (pm) {
				order.unshift(pm);
			}
			for (const key of order) {
				if (options.some((o) => o.name === key)) return key;
			}
			return options[0]?.name ?? "pnpm";
		});

		const { copy, copied, reset } = useClipboard();

		return (
			<DarkTheme full>
				<Flex col bg={"#1a1a1a"} rounded={"l3"} full>
					<Flex
						gap={2}
						px={4}
						py={2}
						borderBottom={"1px solid"}
						borderBottomColor={"whiteAlpha.300!"}
						role="tablist"
						aria-label="Package manager"
						align={"center"}
						justify={"space-between"}
					>
						<Flex gap={2} align={"center"}>
							<Icon boxSize={"4"} as={FaTerminal} color={"fg.medium"} />

							{options.map((o) => (
								<Button
									key={o.name}
									color={active === o.name ? "fg" : "fg.medium"}
									px={2}
									fontWeight={"medium"}
									py={1}
									_hover={{
										color: "fg"
									}}
									size={"sm"}
									variant={"link"}
									onClick={() => {
										updatePm(o.name as PM);
										setActive(o.name);
										reset();
									}}
								>
									{o.name}
								</Button>
							))}
						</Flex>

						<IconButton
							variant={"link"}
							p={2}
							icon={<Icon boxSize={"4"} as={copied ? LuCheck : LuCopy} />}
							aria-label="Copy"
							color={"fg.medium"}
							_hover={{
								color: "fg"
							}}
							onClick={() => {
								copy(options.find((o) => o.name === active)?.content as string);
							}}
						/>
					</Flex>

					<Flex px={4} py={4}>
						{options.map((o) => (
							<Flex
								key={o.name}
								role="tabpanel"
								aria-hidden={active !== o.name}
								display={active === o.name ? "flex" : "none"}
								color={"fg.medium"}
							>
								<Box as={"pre"} whiteSpace={"pre-wrap"} m={0} p={0}>
									<code>{o.content}</code>
								</Box>
							</Flex>
						))}
					</Flex>
				</Flex>
			</DarkTheme>
		);
	},
	{ Option }
);
