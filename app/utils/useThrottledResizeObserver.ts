export default () => {
	const _ResizeObserver = window.ResizeObserver

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	;(window as any).ResizeObserver = class ResizeObserver extends (
		_ResizeObserver
	) {
		constructor(callback: (...args: unknown[]) => void) {
			callback = useDebounceFn(callback, 20)

			super(callback)
		}
	}
}
