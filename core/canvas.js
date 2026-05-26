/**
 * Canvas helpers used by the games.
 * `fitCanvasToContainer` keeps a canvas's backing-store sized to its
 * CSS box, respecting devicePixelRatio. Returns a `dispose` function.
 */
export function fitCanvasToContainer(canvas, scope, onResize) {
	if (!canvas) return () => {};
	const dpr = () => Math.max(1, window.devicePixelRatio || 1);

	function apply() {
		const r = canvas.getBoundingClientRect();
		const w = Math.max(1, Math.round(r.width));
		const h = Math.max(1, Math.round(r.height));
		const ratio = dpr();
		canvas.width  = w * ratio;
		canvas.height = h * ratio;
		if (onResize) onResize({ width: w, height: h, dpr: ratio });
	}

	const obs = new ResizeObserver(apply);
	obs.observe(canvas);
	scope.observe(obs);
	apply();
	return apply;
}

/**
 * Convert hex to a shaded hex (percent in [-100,100]).
 * Used by the chargebot isometric renderer.
 */
export function shadeColor(color, percent) {
	const num = parseInt(color.replace('#', ''), 16);
	const amt = Math.round(2.55 * percent);
	const clamp = (v) => Math.max(0, Math.min(255, v));
	const R = clamp((num >> 16) + amt);
	const G = clamp(((num >> 8) & 0xFF) + amt);
	const B = clamp((num & 0xFF) + amt);
	return '#' + ((1 << 24) + (R << 16) + (G << 8) + B).toString(16).slice(1);
}
