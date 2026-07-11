export function textResponse(data: unknown) {
	return {
		content: [
			{
				type: "text" as const,
				text: typeof data === "string" ? data : JSON.stringify(data, null, 2)
			}
		]
	};
}

export function errorResponse(message: string) {
	return textResponse({ error: message });
}
