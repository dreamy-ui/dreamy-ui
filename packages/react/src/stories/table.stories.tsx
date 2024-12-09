import {
    Table,
    TableBody,
    TableCell,
    TableColumnHeader,
    TableHeader,
    TableRow
} from "@/components";
import type { Meta } from "@storybook/react";

export default {
    title: "Table"
} satisfies Meta;

export function Base() {
    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableColumnHeader>Name</TableColumnHeader>
                    <TableColumnHeader>Age</TableColumnHeader>
                    <TableColumnHeader>Gender</TableColumnHeader>
                </TableRow>
            </TableHeader>
            <TableBody>
                {[20, 22, 25].map((item, index) => (
                    <TableRow key={index}>
                        <TableCell>Name {index + 1}</TableCell>
                        <TableCell>{item}</TableCell>
                        <TableCell>{item % 5 === 0 ? "Male" : "Female"}</TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );
}

export function Size() {
    return (
        <>
            <Table size={"sm"}>
                <TableHeader>
                    <TableRow>
                        <TableColumnHeader>Name</TableColumnHeader>
                        <TableColumnHeader>Age</TableColumnHeader>
                        <TableColumnHeader>Gender</TableColumnHeader>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {[20, 22, 25].map((item, index) => (
                        <TableRow key={index}>
                            <TableCell>Name {index + 1}</TableCell>
                            <TableCell>{item}</TableCell>
                            <TableCell>{item % 5 === 0 ? "Male" : "Female"}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
            <Table size={"md"}>
                <TableHeader>
                    <TableRow>
                        <TableColumnHeader>Name</TableColumnHeader>
                        <TableColumnHeader>Age</TableColumnHeader>
                        <TableColumnHeader>Gender</TableColumnHeader>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {[20, 22, 25].map((item, index) => (
                        <TableRow key={index}>
                            <TableCell>Name {index + 1}</TableCell>
                            <TableCell>{item}</TableCell>
                            <TableCell>{item % 5 === 0 ? "Male" : "Female"}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
            <Table size={"lg"}>
                <TableHeader>
                    <TableRow>
                        <TableColumnHeader>Name</TableColumnHeader>
                        <TableColumnHeader>Age</TableColumnHeader>
                        <TableColumnHeader>Gender</TableColumnHeader>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {[20, 22, 25].map((item, index) => (
                        <TableRow key={index}>
                            <TableCell>Name {index + 1}</TableCell>
                            <TableCell>{item}</TableCell>
                            <TableCell>{item % 5 === 0 ? "Male" : "Female"}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </>
    );
}

export function Variant() {
    return (
        <>
            <Table variant={"simple"}>
                <TableHeader>
                    <TableRow>
                        <TableColumnHeader>Name</TableColumnHeader>
                        <TableColumnHeader>Age</TableColumnHeader>
                        <TableColumnHeader>Gender</TableColumnHeader>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {[20, 22, 25].map((item, index) => (
                        <TableRow key={index}>
                            <TableCell>Name {index + 1}</TableCell>
                            <TableCell>{item}</TableCell>
                            <TableCell>{item % 5 === 0 ? "Male" : "Female"}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
            <Table variant={"line"}>
                <TableHeader>
                    <TableRow>
                        <TableColumnHeader>Name</TableColumnHeader>
                        <TableColumnHeader>Age</TableColumnHeader>
                        <TableColumnHeader>Gender</TableColumnHeader>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {[20, 22, 25].map((item, index) => (
                        <TableRow key={index}>
                            <TableCell>Name {index + 1}</TableCell>
                            <TableCell>{item}</TableCell>
                            <TableCell>{item % 5 === 0 ? "Male" : "Female"}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </>
    );
}

export function Background() {
    return (
        <>
            <Table withBackground>
                <TableHeader>
                    <TableRow>
                        <TableColumnHeader>Name</TableColumnHeader>
                        <TableColumnHeader>Age</TableColumnHeader>
                        <TableColumnHeader>Gender</TableColumnHeader>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {[20, 22, 25].map((item, index) => (
                        <TableRow key={index}>
                            <TableCell>Name {index + 1}</TableCell>
                            <TableCell>{item}</TableCell>
                            <TableCell>{item % 5 === 0 ? "Male" : "Female"}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
            <Table
                withBackground
                variant="line"
            >
                <TableHeader>
                    <TableRow>
                        <TableColumnHeader>Name</TableColumnHeader>
                        <TableColumnHeader>Age</TableColumnHeader>
                        <TableColumnHeader>Gender</TableColumnHeader>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {[20, 22, 25].map((item, index) => (
                        <TableRow key={index}>
                            <TableCell>Name {index + 1}</TableCell>
                            <TableCell>{item}</TableCell>
                            <TableCell>{item % 5 === 0 ? "Male" : "Female"}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </>
    );
}
