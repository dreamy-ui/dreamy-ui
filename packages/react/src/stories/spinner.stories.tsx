import { Spinner } from "@/rsc";
import type { Meta } from "@storybook/react";

export default {
	title: "Spinner"
} satisfies Meta;

export function Base() {
	return <Spinner />;
}

export function Size() {
	return (
		<>
			<Spinner size="sm" />
			<Spinner size="md" />
			<Spinner size="lg" />
		</>
	);
}

export function Color() {
	return (
		<>
			<Spinner color="primary" />
			<Spinner color="secondary" />
			<Spinner color="success" />
			<Spinner color="warning" />
			<Spinner color="error" />
			<Spinner color="info" />
			<Spinner color="none" />
		</>
	);
}

export function Speed() {
	return (
		<>
			<Spinner speed="1s" />
			<Spinner speed="3s" />
			<Spinner speed="400ms" />
		</>
	);
}
