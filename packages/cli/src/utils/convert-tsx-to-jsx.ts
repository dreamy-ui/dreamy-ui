import { transform } from "sucrase";

export function convertTsxToJsx(code: string) {
	const jsx = transform(code, {
		transforms: ["jsx", "typescript"],
		jsxRuntime: "preserve"
	});
	return jsx.code;
}
