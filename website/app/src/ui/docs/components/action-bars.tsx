"use client";

import { ActionBar, Button, Checkbox, Switch, Table } from "@/ui";
import { useCallback, useState } from "react";
import { LuDownload, LuFolderPlus, LuShare, LuSquarePlus, LuTrash } from "react-icons/lu";
import type { ActionBarVariantProps } from "styled-system/recipes";

export function ControlledActionBar() {
    const [open, setOpen] = useState(false);

    return (
        <>
            <Switch
                checked={open}
                onCheckedChange={(checked) => setOpen(checked)}
                size={"sm"}
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

export function ActionBarWithClose() {
    const [open, setOpen] = useState(false);

    return (
        <>
            <Switch
                checked={open}
                onCheckedChange={(checked) => setOpen(checked)}
                size={"sm"}
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
                        rightIcon={<LuSquarePlus />}
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

export function ActionBarMultiple() {
    const [open, setOpen] = useState(false);

    return (
        <>
            <Switch
                checked={open}
                onCheckedChange={(checked) => setOpen(checked)}
                size={"sm"}
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
                        rightIcon={<LuDownload />}
                        size="sm"
                        variant="outline"
                    >
                        Download
                    </Button>
                    <Button
                        rightIcon={<LuShare />}
                        size="sm"
                        variant="outline"
                    >
                        Share
                    </Button>
                    <Button
                        rightIcon={<LuFolderPlus />}
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

export function ActionBarSizes({ size = "md" }: { size?: "sm" | "md" | "lg" }) {
    const [open, setOpen] = useState(false);

    return (
        <>
            <Switch
                checked={open}
                onCheckedChange={(checked) => setOpen(checked)}
                size={"sm"}
            >
                Show {size} Action Bar
            </Switch>

            <ActionBar.Root
                onOpenChange={setOpen}
                open={open}
                size={size}
            >
                <ActionBar.Content>
                    <ActionBar.SelectionTrigger>2 selected</ActionBar.SelectionTrigger>
                    <ActionBar.Separator />
                    <Button
                        color="error"
                        size={size}
                        variant="outline"
                    >
                        Delete
                    </Button>
                    <ActionBar.CloseTrigger size={size} />
                </ActionBar.Content>
            </ActionBar.Root>
        </>
    );
}

interface User {
    id: number;
    name: string;
    age: number;
    gender: string;
    isSelected: boolean;
}

export function ActionBarTable() {
    const [users, setUsers] = useState<User[]>([
        { id: 1, name: "John Doe", age: 20, gender: "Male", isSelected: false },
        { id: 2, name: "Jane Doe", age: 22, gender: "Female", isSelected: false },
        { id: 3, name: "Jim Doe", age: 25, gender: "Male", isSelected: false }
    ]);

    const open = users.some((user) => user.isSelected);

    const unselectAll = useCallback(() => {
        setUsers((prev) => prev.map((user) => ({ ...user, isSelected: false })));
    }, []);

    const toggleSelection = useCallback((id: number) => {
        setUsers((prev) =>
            prev.map((user) => (user.id === id ? { ...user, isSelected: !user.isSelected } : user))
        );
    }, []);

    const toggleSelectionAll = useCallback(() => {
        setUsers((prev) =>
            prev.map((user) => ({ ...user, isSelected: !prev.every((user) => user.isSelected) }))
        );
    }, []);

    const allSelected = users.every((user) => user.isSelected);
    const someSelected = users.some((user) => user.isSelected);

    return (
        <>
            <Table.Root
                variant={"simple"}
                w="full"
                withBackground
            >
                <Table.Table>
                    <Table.Header>
                        <Table.Row>
                            <Table.ColumnHeader w={"60px"}>
                                <Checkbox
                                    checked={
                                        someSelected && !allSelected ? "indeterminate" : allSelected
                                    }
                                    onCheckedChange={toggleSelectionAll}
                                />
                            </Table.ColumnHeader>
                            <Table.ColumnHeader>Name</Table.ColumnHeader>
                            <Table.ColumnHeader>Age</Table.ColumnHeader>
                            <Table.ColumnHeader>Gender</Table.ColumnHeader>
                        </Table.Row>
                    </Table.Header>
                    <Table.Body>
                        {users.map((user, index) => (
                            <Table.Row
                                _first={{
                                    "& > td:first-of-type": {
                                        borderStartStartRadius: "l2"
                                    },
                                    "& > td:last-of-type": {
                                        borderStartEndRadius: "l2"
                                    }
                                }}
                                _hover={{
                                    bg: "alpha.50"
                                }}
                                _last={{
                                    "& > td:first-of-type": {
                                        borderEndStartRadius: "l2"
                                    },
                                    "& > td:last-of-type": {
                                        borderEndEndRadius: "l2"
                                    }
                                }}
                                bg={user.isSelected ? "alpha.50" : "transparent"}
                                cursor={"pointer"}
                                key={index}
                                onClick={() => toggleSelection(user.id)}
                            >
                                <Table.Cell w={"60px"}>
                                    <Checkbox
                                        checked={user.isSelected}
                                        onCheckedChange={() => toggleSelection(user.id)}
                                    />
                                </Table.Cell>
                                <Table.Cell>{user.name}</Table.Cell>
                                <Table.Cell>{user.age}</Table.Cell>
                                <Table.Cell>{user.gender}</Table.Cell>
                            </Table.Row>
                        ))}
                    </Table.Body>
                </Table.Table>
            </Table.Root>

            <ActionBar.Root
                onOpenChange={(next) => {
                    if (!next) unselectAll();
                }}
                open={open}
            >
                <ActionBar.Content>
                    <ActionBar.SelectionTrigger>
                        {users.filter((user) => user.isSelected).length} selected
                    </ActionBar.SelectionTrigger>
                    <ActionBar.Separator />
                    <Button
                        size="sm"
                        variant="outline"
                    >
                        Download
                    </Button>
                    <Button
                        color="error"
                        onClick={unselectAll}
                        rightIcon={<LuTrash />}
                        size="sm"
                        variant="outline"
                    >
                        Delete
                    </Button>
                </ActionBar.Content>
            </ActionBar.Root>
        </>
    );
}
