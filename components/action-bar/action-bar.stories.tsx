import { ActionBar, Button, Switch } from "@/ui";
import { useControllable } from "@dreamy-ui/react";
import type { Meta } from "@storybook/react-vite";
import { useState } from "react";
import { LuShare, LuTrash } from "react-icons/lu";

export default {
    title: "Action Bar"
} satisfies Meta;

export function Base() {
    const { isOpen, onToggle, onClose } = useControllable();

    return (
        <>
            <Switch
                isChecked={isOpen}
                onChangeValue={onToggle}
                size="sm"
            >
                Show Action Bar
            </Switch>

            <ActionBar.Root
                isOpen={isOpen}
                onClose={onClose}
            >
                <ActionBar.Content>
                    <ActionBar.SelectionTrigger>2 items selected</ActionBar.SelectionTrigger>
                    <ActionBar.Separator />
                    <Button
                        rightIcon={<LuTrash />}
                        size="sm"
                        variant="outline"
                    >
                        Delete
                    </Button>
                    <Button
                        rightIcon={<LuShare />}
                        size="sm"
                        variant="outline"
                    >
                        Share
                    </Button>
                </ActionBar.Content>
            </ActionBar.Root>
        </>
    );
}

export function WithClose() {
    const { isOpen, onToggle, onClose } = useControllable();

    return (
        <>
            <Switch
                isChecked={isOpen}
                onChangeValue={onToggle}
                size="sm"
            >
                Show Action Bar
            </Switch>

            <ActionBar.Root
                isOpen={isOpen}
                onClose={onClose}
            >
                <ActionBar.Content>
                    <ActionBar.SelectionTrigger>5 items selected</ActionBar.SelectionTrigger>
                    <ActionBar.Separator />
                    <Button
                        size="sm"
                        variant="outline"
                    >
                        Add to collection
                    </Button>
                    <Button
                        color="error"
                        rightIcon={<LuTrash />}
                        size="sm"
                    >
                        Delete items
                    </Button>
                    <ActionBar.CloseTrigger />
                </ActionBar.Content>
            </ActionBar.Root>
        </>
    );
}

export function MultipleActions() {
    const { isOpen, onToggle, onClose } = useControllable();

    return (
        <>
            <Switch
                isChecked={isOpen}
                onChangeValue={onToggle}
                size="sm"
            >
                Show Action Bar
            </Switch>

            <ActionBar.Root
                isOpen={isOpen}
                onClose={onClose}
            >
                <ActionBar.Content>
                    <ActionBar.SelectionTrigger>12 files selected</ActionBar.SelectionTrigger>
                    <ActionBar.Separator />
                    <Button
                        size="sm"
                        variant="outline"
                    >
                        Download
                    </Button>
                    <Button
                        size="sm"
                        variant="outline"
                    >
                        Share
                    </Button>
                    <Button
                        size="sm"
                        variant="outline"
                    >
                        Move to folder
                    </Button>
                    <ActionBar.Separator />
                    <Button
                        color="error"
                        rightIcon={<LuTrash />}
                        size="sm"
                    >
                        Delete
                    </Button>
                </ActionBar.Content>
            </ActionBar.Root>
        </>
    );
}

export function Sizes() {
    const { isOpen: isOpenSm, onToggle: onToggleSm, onClose: onCloseSm } = useControllable();
    const { isOpen: isOpenMd, onToggle: onToggleMd, onClose: onCloseMd } = useControllable();
    const { isOpen: isOpenLg, onToggle: onToggleLg, onClose: onCloseLg } = useControllable();

    return (
        <>
            <Switch
                isChecked={isOpenSm}
                onChangeValue={onToggleSm}
                size="sm"
            >
                Show Small Action Bar
            </Switch>
            <ActionBar.Root
                isOpen={isOpenSm}
                onClose={onCloseSm}
                size="sm"
            >
                <ActionBar.Content>
                    <ActionBar.SelectionTrigger>2 selected</ActionBar.SelectionTrigger>
                    <ActionBar.Separator />
                    <Button
                        color="error"
                        size="sm"
                        variant="outline"
                    >
                        Delete
                    </Button>
                    <ActionBar.CloseTrigger size="sm" />
                </ActionBar.Content>
            </ActionBar.Root>

            <Switch
                isChecked={isOpenMd}
                onChangeValue={onToggleMd}
                size="sm"
            >
                Show Medium Action Bar
            </Switch>
            <ActionBar.Root
                isOpen={isOpenMd}
                onClose={onCloseMd}
                size="md"
            >
                <ActionBar.Content>
                    <ActionBar.SelectionTrigger>2 selected</ActionBar.SelectionTrigger>
                    <ActionBar.Separator />
                    <Button
                        color="error"
                        size="md"
                        variant="outline"
                    >
                        Delete
                    </Button>
                    <ActionBar.CloseTrigger size="md" />
                </ActionBar.Content>
            </ActionBar.Root>

            <Switch
                isChecked={isOpenLg}
                onChangeValue={onToggleLg}
                size="sm"
            >
                Show Large Action Bar
            </Switch>
            <ActionBar.Root
                isOpen={isOpenLg}
                onClose={onCloseLg}
                size="lg"
            >
                <ActionBar.Content>
                    <ActionBar.SelectionTrigger>2 selected</ActionBar.SelectionTrigger>
                    <ActionBar.Separator />
                    <Button
                        color="error"
                        size="lg"
                        variant="outline"
                    >
                        Delete
                    </Button>
                    <ActionBar.CloseTrigger size="lg" />
                </ActionBar.Content>
            </ActionBar.Root>
        </>
    );
}
