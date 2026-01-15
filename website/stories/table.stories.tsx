import { Table, Text } from "@/ui";
import type { Meta } from "@storybook/react-vite";

export default {
    title: "Table"
} satisfies Meta;

export function Base() {
    return (
        <Table.Root w="full">
            <Table.Table>
                <Table.Header>
                    <Table.Row>
                        <Table.ColumnHeader>Name</Table.ColumnHeader>
                        <Table.ColumnHeader>Age</Table.ColumnHeader>
                        <Table.ColumnHeader>Gender</Table.ColumnHeader>
                    </Table.Row>
                </Table.Header>
                <Table.Body>
                    {[20, 22, 25].map((item, index) => (
                        <Table.Row key={index}>
                            <Table.Cell>Name {index + 1}</Table.Cell>
                            <Table.Cell>{item}</Table.Cell>
                            <Table.Cell>{item % 5 === 0 ? "Male" : "Female"}</Table.Cell>
                        </Table.Row>
                    ))}
                </Table.Body>
            </Table.Table>
        </Table.Root>
    );
}

export function Variants() {
    return (
        <>
            {["simple", "line"].map((variant) => (
                <div key={variant}>
                    <Text size="lg">{variant}</Text>
                    <Table.Root
                        variant={variant as any}
                        w="full"
                    >
                        <Table.Table>
                            <Table.Header>
                                <Table.Row>
                                    <Table.ColumnHeader>Name</Table.ColumnHeader>
                                    <Table.ColumnHeader>Age</Table.ColumnHeader>
                                    <Table.ColumnHeader>Gender</Table.ColumnHeader>
                                </Table.Row>
                            </Table.Header>
                            <Table.Body>
                                {[20, 22, 25].map((item, index) => (
                                    <Table.Row key={index}>
                                        <Table.Cell>Name {index + 1}</Table.Cell>
                                        <Table.Cell>{item}</Table.Cell>
                                        <Table.Cell>
                                            {item % 5 === 0 ? "Male" : "Female"}
                                        </Table.Cell>
                                    </Table.Row>
                                ))}
                            </Table.Body>
                        </Table.Table>
                    </Table.Root>
                </div>
            ))}
        </>
    );
}

export function WithBackground() {
    return (
        <>
            {["simple", "line"].map((variant) => (
                <div key={variant}>
                    <Text size="lg">{variant}</Text>
                    <Table.Root
                        variant={variant as any}
                        w="full"
                        withBackground
                    >
                        <Table.Table>
                            <Table.Header>
                                <Table.Row>
                                    <Table.ColumnHeader>Name</Table.ColumnHeader>
                                    <Table.ColumnHeader>Age</Table.ColumnHeader>
                                    <Table.ColumnHeader>Gender</Table.ColumnHeader>
                                </Table.Row>
                            </Table.Header>
                            <Table.Body>
                                {[20, 22, 25].map((item, index) => (
                                    <Table.Row key={index}>
                                        <Table.Cell>Name {index + 1}</Table.Cell>
                                        <Table.Cell>{item}</Table.Cell>
                                        <Table.Cell>
                                            {item % 5 === 0 ? "Male" : "Female"}
                                        </Table.Cell>
                                    </Table.Row>
                                ))}
                            </Table.Body>
                        </Table.Table>
                    </Table.Root>
                </div>
            ))}
        </>
    );
}

export function Interactive() {
    return (
        <Table.Root
            interactive
            w="full"
        >
            <Table.Table>
                <Table.Header>
                    <Table.Row>
                        <Table.ColumnHeader>Name</Table.ColumnHeader>
                        <Table.ColumnHeader>Age</Table.ColumnHeader>
                        <Table.ColumnHeader>Gender</Table.ColumnHeader>
                    </Table.Row>
                </Table.Header>
                <Table.Body>
                    {[20, 22, 25].map((item, index) => (
                        <Table.Row key={index}>
                            <Table.Cell>Name {index + 1}</Table.Cell>
                            <Table.Cell>{item}</Table.Cell>
                            <Table.Cell>{item % 5 === 0 ? "Male" : "Female"}</Table.Cell>
                        </Table.Row>
                    ))}
                </Table.Body>
            </Table.Table>
        </Table.Root>
    );
}

export function Striped() {
    return (
        <Table.Root
            striped
            w="full"
        >
            <Table.Table>
                <Table.Header>
                    <Table.Row>
                        <Table.ColumnHeader>Name</Table.ColumnHeader>
                        <Table.ColumnHeader>Age</Table.ColumnHeader>
                        <Table.ColumnHeader>Gender</Table.ColumnHeader>
                    </Table.Row>
                </Table.Header>
                <Table.Body>
                    {[20, 22, 25, 28, 31, 35].map((item, index) => (
                        <Table.Row key={index}>
                            <Table.Cell>Name {index + 1}</Table.Cell>
                            <Table.Cell>{item}</Table.Cell>
                            <Table.Cell>{item % 5 === 0 ? "Male" : "Female"}</Table.Cell>
                        </Table.Row>
                    ))}
                </Table.Body>
            </Table.Table>
        </Table.Root>
    );
}

export function Sizes() {
    return (
        <>
            {["sm", "md", "lg"].map((size) => (
                <div key={size}>
                    <Text size="lg">{size}</Text>
                    <Table.Root
                        size={size as any}
                        w="full"
                    >
                        <Table.Table>
                            <Table.Header>
                                <Table.Row>
                                    <Table.ColumnHeader>Name</Table.ColumnHeader>
                                    <Table.ColumnHeader>Age</Table.ColumnHeader>
                                    <Table.ColumnHeader>Gender</Table.ColumnHeader>
                                </Table.Row>
                            </Table.Header>
                            <Table.Body>
                                {[20, 22, 25].map((item, index) => (
                                    <Table.Row key={index}>
                                        <Table.Cell>Name {index + 1}</Table.Cell>
                                        <Table.Cell>{item}</Table.Cell>
                                        <Table.Cell>
                                            {item % 5 === 0 ? "Male" : "Female"}
                                        </Table.Cell>
                                    </Table.Row>
                                ))}
                            </Table.Body>
                        </Table.Table>
                    </Table.Root>
                </div>
            ))}
        </>
    );
}
