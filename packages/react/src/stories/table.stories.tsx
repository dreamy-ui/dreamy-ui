import {
	Table,
	TableBody,
	TableCell,
	TableColumnHeader,
	TableContainer,
	TableHeader,
	TableRow
} from "@/components";
import type { Meta } from "@storybook/react";

export default {
	title: "Table"
} satisfies Meta;

export function Base() {
	return (
		<TableContainer>
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
							<TableCell>
								{item % 5 === 0 ? "Male" : "Female"}
							</TableCell>
						</TableRow>
					))}
				</TableBody>
			</Table>
		</TableContainer>
	);
}

export function Size() {
	return (
		<>
			<TableContainer size={"sm"}>
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
								<TableCell>
									{item % 5 === 0 ? "Male" : "Female"}
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</TableContainer>
			<TableContainer size={"md"}>
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
								<TableCell>
									{item % 5 === 0 ? "Male" : "Female"}
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</TableContainer>
			<TableContainer size={"lg"}>
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
								<TableCell>
									{item % 5 === 0 ? "Male" : "Female"}
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</TableContainer>
		</>
	);
}

export function Variant() {
	return (
		<>
			<TableContainer variant={"simple"}>
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
								<TableCell>
									{item % 5 === 0 ? "Male" : "Female"}
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</TableContainer>
			<TableContainer variant={"line"}>
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
								<TableCell>
									{item % 5 === 0 ? "Male" : "Female"}
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</TableContainer>
		</>
	);
}

export function Background() {
	return (
		<>
			<TableContainer withBackground>
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
								<TableCell>
									{item % 5 === 0 ? "Male" : "Female"}
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</TableContainer>
			<TableContainer withBackground variant="line">
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
								<TableCell>
									{item % 5 === 0 ? "Male" : "Female"}
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</TableContainer>
		</>
	);
}
