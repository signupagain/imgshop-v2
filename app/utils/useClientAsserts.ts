export function assertIsEventTarget(
	value: unknown
): asserts value is EventTarget {
	if (!(value instanceof EventTarget)) throw new Error('Not a EventTarget.')
}

export function assertIsNode(value: unknown): asserts value is Node {
	if (!(value instanceof Node)) throw new Error('Not a Node.')
}

export function assertIsHTMLElement(
	value: unknown
): asserts value is HTMLElement {
	if (!(value instanceof HTMLElement)) throw new Error('Not a HtmlElement.')
}

export function assertIsMouseEvent(
	value: unknown
): asserts value is MouseEvent {
	if (!(value instanceof MouseEvent)) throw new Error('Not a MouseEvent.')
}
