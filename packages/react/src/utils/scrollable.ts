export function isScrollable(node: Element, checkForOverflow?: boolean): boolean {
	const style = window.getComputedStyle(node);
	let isScrollable = /(auto|scroll)/.test(style.overflow + style.overflowX + style.overflowY);

	if (isScrollable && checkForOverflow) {
		isScrollable = node.scrollHeight !== node.clientHeight || node.scrollWidth !== node.clientWidth;
	}

	return isScrollable;
}


export function getScrollParent(node: Element, checkForOverflow?: boolean): Element {
	let scrollableNode: Element | null = node;
	if (isScrollable(scrollableNode, checkForOverflow)) {
		scrollableNode = scrollableNode.parentElement;
	}

	while (scrollableNode && !isScrollable(scrollableNode, checkForOverflow)) {
		scrollableNode = scrollableNode.parentElement;
	}

	return scrollableNode || document.scrollingElement || document.documentElement;
}