import { ActionBar, Button, Switch } from "@/ui";
import type { Meta } from "@storybook/react-vite";
import { useState } from "react";
import { LuShare, LuTrash } from "react-icons/lu";

export default {
    title: "Action Bar"
} satisfies Meta;

export function Base() {
    const [open, setOpen] = useState(false);

    return (
        <>
            <Switch
                checked={open}
                onCheckedChange={(checked) => setOpen(checked)}
                size="sm"
            >
                Show Action Bar
            </Switch>

            <ActionBar.Root
                onOpenChange={setOpen}
                open={open}
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
    const [open, setOpen] = useState(false);

    return (
        <>
            <Switch
                checked={open}
                onCheckedChange={(checked) => setOpen(checked)}
                size="sm"
            >
                Show Action Bar
            </Switch>

            <ActionBar.Root
                onOpenChange={setOpen}
                open={open}
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
    const [open, setOpen] = useState(false);

    return (
        <>
            <Switch
                checked={open}
                onCheckedChange={(checked) => setOpen(checked)}
                size="sm"
            >
                Show Action Bar
            </Switch>

            <ActionBar.Root
                onOpenChange={setOpen}
                open={open}
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
    const [openSm, setOpenSm] = useState(false);
    const [openMd, setOpenMd] = useState(false);
    const [openLg, setOpenLg] = useState(false);

    return (
        <>
            <Switch
                checked={openSm}
                onCheckedChange={(checked) => setOpenSm(checked)}
                size="sm"
            >
                Show Small Action Bar
            </Switch>
            <ActionBar.Root
                onOpenChange={setOpenSm}
                open={openSm}
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
                checked={openMd}
                onCheckedChange={(checked) => setOpenMd(checked)}
                size="sm"
            >
                Show Medium Action Bar
            </Switch>
            <ActionBar.Root
                onOpenChange={setOpenMd}
                open={openMd}
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
                checked={openLg}
                onCheckedChange={(checked) => setOpenLg(checked)}
                size="sm"
            >
                Show Large Action Bar
            </Switch>
            <ActionBar.Root
                onOpenChange={setOpenLg}
                open={openLg}
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
