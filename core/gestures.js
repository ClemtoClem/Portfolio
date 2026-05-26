/**
 * Pointer-event based drag tracker.
 * Unifies mouse + touch + pen via pointer events. Returns an object
 * exposing onStart/onMove/onEnd hooks. All listeners are registered
 * through the provided EventScope.
 */
export function dragTracker(target, scope, handlers = {}) {
	let active = false;
	let startX = 0, startY = 0;

	function down(e) {
		// Only respond to primary button or touch
		if (e.button !== undefined && e.button !== 0) return;
		active = true;
		startX = e.clientX; startY = e.clientY;
		try { target.setPointerCapture(e.pointerId); } catch (_) {}
		handlers.onStart && handlers.onStart(e, { startX, startY });
	}

	function move(e) {
		if (!active) return;
		const dx = e.clientX - startX;
		const dy = e.clientY - startY;
		handlers.onMove && handlers.onMove(e, { dx, dy, startX, startY });
	}

	function up(e) {
		if (!active) return;
		active = false;
		const dx = e.clientX - startX;
		const dy = e.clientY - startY;
		try { target.releasePointerCapture(e.pointerId); } catch (_) {}
		handlers.onEnd && handlers.onEnd(e, { dx, dy, startX, startY });
	}

	scope.on(target, 'pointerdown', down);
	scope.on(target, 'pointermove', move);
	scope.on(target, ['pointerup', 'pointercancel', 'pointerleave'], up);
}
