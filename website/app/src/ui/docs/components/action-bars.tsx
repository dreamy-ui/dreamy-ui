"use client";

import { ActionBar } from "@/action-bar";
import { Button } from "@/button";
import { CheckboxCard } from "@/checkbox-card";
import { CloseButton } from "@/close-button";
import { Wrap } from "@/wrap";
import { useControllable } from "@dreamy-ui/react";
import { useState } from "react";
import { LuDownload, LuFolderPlus, LuShare, LuSquarePlus, LuTrash } from "react-icons/lu";

export function ControlledActionBar() {
    const { isOpen, onToggle, onClose } = useControllable({
        defaultIsOpen: false
    });

    return (
        <>
            <Button onClick={onToggle}>{isOpen ? "Hide" : "Show"} Action Bar</Button>

            <ActionBar.Root
                isOpen={isOpen}
                onClose={onClose}
            >
                <ActionBar.Content>
                    <ActionBar.SelectionTrigger>2 items selected</ActionBar.SelectionTrigger>
                    <ActionBar.Separator />
                    <Button
                        size="sm"
                        variant="outline"
                        rightIcon={<LuTrash />}
                    >
                        Delete
                    </Button>
                    <Button
                        size="sm"
                        variant="outline"
                        rightIcon={<LuShare />}
                    >
                        Share
                    </Button>
                </ActionBar.Content>
            </ActionBar.Root>
        </>
    );
}

export function BasicActionBar() {
    const { isOpen, onOpen, onClose } = useControllable({
        defaultIsOpen: false
    });

    return (
        <>
            <Button onClick={onOpen}>Show Action Bar</Button>

            <ActionBar.Root
                isOpen={isOpen}
                onClose={onClose}
            >
                <ActionBar.Content>
                    <ActionBar.SelectionTrigger>3 selected</ActionBar.SelectionTrigger>
                    <ActionBar.Separator />
                    <Button
                        size="sm"
                        variant="outline"
                        rightIcon={<LuTrash />}
                    >
                        Delete
                    </Button>
                    <ActionBar.CloseTrigger />
                </ActionBar.Content>
            </ActionBar.Root>
        </>
    );
}

export function ActionBarWithClose() {
    const { isOpen, onOpen, onClose } = useControllable({
        defaultIsOpen: false
    });

    return (
        <>
            <Button onClick={onOpen}>Show Action Bar</Button>

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
                        rightIcon={<LuSquarePlus />}
                    >
                        Add to collection
                    </Button>
                    <Button
                        size="sm"
                        color="error"
                        rightIcon={<LuTrash />}
                    >
                        Delete items
                    </Button>
                    <ActionBar.CloseTrigger />
                </ActionBar.Content>
            </ActionBar.Root>
        </>
    );
}

export function ActionBarMultiple() {
    const { isOpen, onOpen, onClose } = useControllable({
        defaultIsOpen: false
    });

    return (
        <>
            <Button onClick={onOpen}>Show Action Bar</Button>

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
                        rightIcon={<LuDownload />}
                    >
                        Download
                    </Button>
                    <Button
                        size="sm"
                        variant="outline"
                        rightIcon={<LuShare />}
                    >
                        Share
                    </Button>
                    <Button
                        size="sm"
                        variant="outline"
                        rightIcon={<LuFolderPlus />}
                    >
                        Move to folder
                    </Button>
                    <ActionBar.Separator />
                    <Button
                        size="sm"
                        color="error"
                        rightIcon={<LuTrash />}
                    >
                        Delete
                    </Button>
                </ActionBar.Content>
            </ActionBar.Root>
        </>
    );
}

export function ActionBarSizes({ size = "md" }: { size?: "sm" | "md" | "lg" }) {
    const { isOpen, onOpen, onClose } = useControllable({
        defaultIsOpen: false
    });

    return (
        <>
            <Button
                onClick={onOpen}
                size={size}
            >
                Show {size} Action Bar
            </Button>

            <ActionBar.Root
                isOpen={isOpen}
                onClose={onClose}
                size={size}
            >
                <ActionBar.Content>
                    <ActionBar.SelectionTrigger>2 selected</ActionBar.SelectionTrigger>
                    <ActionBar.Separator />
                    <Button
                        size={size}
                        variant="outline"
                    >
                        Delete
                    </Button>
                    <ActionBar.CloseTrigger>
                        <CloseButton size={size} />
                    </ActionBar.CloseTrigger>
                </ActionBar.Content>
            </ActionBar.Root>
        </>
    );
}

export function ActionBarTable() {
    const [selectedItems, setSelectedItems] = useState<number[]>([]);
    const { isOpen, onClose } = useControllable({
        isOpen: selectedItems.length > 0,
        onClose: () => setSelectedItems([])
    });

    const items = [
        { id: 1, name: "Project A", type: "Folder" },
        { id: 2, name: "Document.pdf", type: "File" },
        { id: 3, name: "Image.jpg", type: "File" }
    ];

    const toggleSelection = (id: number) => {
        setSelectedItems((prev) =>
            prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
        );
    };

    return (
        <>
            <Wrap full>
                {items.map((item) => (
                    <CheckboxCard
                        key={item.id}
                        checked={selectedItems.includes(item.id)}
                        onChange={() => toggleSelection(item.id)}
                        title={item.name}
                        description={item.type}
                    />
                ))}
            </Wrap>

            <ActionBar.Root
                isOpen={isOpen}
                onClose={onClose}
            >
                <ActionBar.Content>
                    <ActionBar.SelectionTrigger>
                        {selectedItems.length} selected
                    </ActionBar.SelectionTrigger>
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
                        color="error"
                        rightIcon={<LuTrash />}
                        onClick={() => setSelectedItems([])}
                    >
                        Delete
                    </Button>
                </ActionBar.Content>
            </ActionBar.Root>
        </>
    );
}
