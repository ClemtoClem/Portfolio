/**
 * Panel — a Flutter-style drawer that slides in from the left or the right.
 *
 *   const panel = new Panel({
 *     parent: appContent,
 *     scope:  ctx.scope,           // auto-disposed
 *     side:   'right',             // 'left' | 'right'
 *     width:  '80%',               // any CSS length
 *     edgeWidth: 24,               // px from the edge that catches a swipe
 *     backdrop: true,
 *   });
 *   panel.contentEl.append(myUi);
 *   panel.on('open', () => …);
 *   panel.toggle();
 *
 * The panel hosts arbitrary DOM in `panel.contentEl`. It opens on:
 *   • `open()` / `toggle()` calls,
 *   • a pointer drag that starts within `edgeWidth` of the closed-side edge
 *     of `parent`, exceeds a small threshold and is mostly horizontal.
 * Once open, dragging it the other way closes it. Tapping the backdrop or
 * pressing Escape also closes it.
 */

const DRAG_THRESHOLD = 6;
const SNAP_RATIO = 0.5;

// Widgets that consume pointer drag themselves — sliders, color pickers,
// anything explicitly opted out with `data-panel-noswipe`. When the
// pointerdown lands on one of these, the panel must NOT engage its own
// drag tracking: doing so would steal the pointer (via setPointerCapture)
// once the gesture crosses the threshold and break the widget.
const DEFAULT_NO_SWIPE = 'input[type=range], input[type=color], [data-panel-noswipe]';

export class Panel {
	constructor({
		parent,
		scope = null,
		side = 'left',
		width = '78%',
		edgeWidth = 24,
		backdrop = true,
		className = '',
		noSwipeSelector = DEFAULT_NO_SWIPE,
	} = {}) {
		if (!parent) throw new Error('Panel: `parent` is required');
		this.parent = parent;
		this.scope = scope;
		this.side = side === 'right' ? 'right' : 'left';
		this.width = width;
		this.edgeWidth = edgeWidth;
		this.noSwipeSelector = noSwipeSelector;
		this.isOpen = false;
		this._listeners = { open: [], close: [] };

		this._ensureContainerStyles();
		this.backdropEl = backdrop ? this._buildBackdrop() : null;
		this.el         = this._buildPanel(className);

		if (this.backdropEl) parent.appendChild(this.backdropEl);
		parent.appendChild(this.el);

		this._bindEvents();
	}

	get contentEl() { return this.el; }

	open()   { this._setOpen(true); }
	close()  { this._setOpen(false); }
	toggle() { this._setOpen(!this.isOpen); }

	on(event, fn) {
		(this._listeners[event] ||= []).push(fn);
		return this;
	}

	dispose() {
		if (this._unbind) this._unbind();
		this.el.remove();
		this.backdropEl?.remove();
	}

	// ── DOM ──────────────────────────────────────────────────
	_ensureContainerStyles() {
		const cs = getComputedStyle(this.parent);
		if (cs.position === 'static') this.parent.style.position = 'relative';
		// Prevent the off-screen panel from causing a horizontal scrollbar.
		if (cs.overflowX !== 'hidden') this.parent.style.overflowX = 'hidden';
	}

	_buildBackdrop() {
		const el = document.createElement('div');
		el.className = 'panel-backdrop';
		Object.assign(el.style, {
			position: 'absolute', inset: '0',
			background: 'rgba(0,0,0,0.45)',
			opacity: '0', pointerEvents: 'none',
			transition: 'opacity 0.25s ease',
			zIndex: '90',
		});
		el.addEventListener('click', () => this.close());
		return el;
	}

	_buildPanel(extraClass) {
		const el = document.createElement('aside');
		el.className = `panel panel-${this.side}${extraClass ? ' ' + extraClass : ''}`;
		Object.assign(el.style, {
			position: 'absolute', top: '0', bottom: '0',
			[this.side]: '0',
			width: this.width,
			maxWidth: '100%',
			background: '#1a1a1a', color: '#fff',
			boxShadow: this.side === 'left'
				? '4px 0 12px rgba(0,0,0,0.35)'
				: '-4px 0 12px rgba(0,0,0,0.35)',
			zIndex: '91',
			transform: this._closedTransform(),
			transition: 'transform 0.28s cubic-bezier(0.25, 0.8, 0.25, 1)',
			touchAction: 'pan-y',
			willChange: 'transform',
		});
		return el;
	}

	_closedTransform() {
		return this.side === 'left' ? 'translateX(-100%)' : 'translateX(100%)';
	}

	_applyPosition(pos /* 0 closed → 1 open */, animate) {
		const clamped = Math.max(0, Math.min(1, pos));
		const tx = this.side === 'left'
			? `${(clamped - 1) * 100}%`
			: `${(1 - clamped) * 100}%`;
		this.el.style.transition = animate
			? 'transform 0.28s cubic-bezier(0.25, 0.8, 0.25, 1)' : 'none';
		this.el.style.transform = `translateX(${tx})`;
		if (this.backdropEl) {
			this.backdropEl.style.transition = animate ? 'opacity 0.25s ease' : 'none';
			this.backdropEl.style.opacity = String(clamped);
			this.backdropEl.style.pointerEvents = clamped > 0.05 ? 'all' : 'none';
		}
	}

	_setOpen(open) {
		const wasOpen = this.isOpen;
		this.isOpen = open;
		this._applyPosition(open ? 1 : 0, true);
		if (wasOpen !== open) {
			(this._listeners[open ? 'open' : 'close'] || []).forEach(fn => {
				try { fn(); } catch (e) { console.error(e); }
			});
		}
	}

	// ── Drag handling ────────────────────────────────────────
	_bindEvents() {
		const offs = [];
		const on = (target, type, fn) => {
			if (this.scope) offs.push(this.scope.on(target, type, fn));
			else {
				target.addEventListener(type, fn);
				offs.push(() => target.removeEventListener(type, fn));
			}
		};

		let pointerId = null;
		let startX = 0, startY = 0;
		let dragging = false;
		let startPos = 0; // 0 closed, 1 open

		const isFromEdge = (e) => {
			const r = this.parent.getBoundingClientRect();
			const x = e.clientX - r.left;
			return this.side === 'left'
				? x <= this.edgeWidth
				: x >= r.width - this.edgeWidth;
		};

		on(this.parent, 'pointerdown', (e) => {
			if (e.pointerType === 'mouse' && e.button !== 0) return;
			const fromEdge = isFromEdge(e);
			const onPanel = this.el.contains(e.target);
			// Start a drag only if it makes sense:
			//   • when closed: only from the catching edge
			//   • when open:   only when grabbing the panel itself
			if (!this.isOpen && !fromEdge) return;
			if (this.isOpen && !onPanel) return;
			// Bail when the gesture lands on a widget that drives its own
			// drag (sliders, color pickers, opt-outs). Otherwise the panel
			// would later capture the pointer and break the widget.
			if (this.noSwipeSelector && e.target.closest(this.noSwipeSelector)) return;
			pointerId = e.pointerId;
			startX = e.clientX;
			startY = e.clientY;
			startPos = this.isOpen ? 1 : 0;
			dragging = false;
		});

		on(this.parent, 'pointermove', (e) => {
			if (e.pointerId !== pointerId) return;
			const dx = e.clientX - startX;
			const dy = e.clientY - startY;

			if (!dragging) {
				if (Math.abs(dx) < DRAG_THRESHOLD && Math.abs(dy) < DRAG_THRESHOLD) return;
				// Cancel if the gesture is clearly vertical.
				if (Math.abs(dy) > Math.abs(dx)) { pointerId = null; return; }
				dragging = true;
				try { this.parent.setPointerCapture(e.pointerId); } catch (_) {}
			}

			const w = this.el.offsetWidth || 1;
			const delta = (this.side === 'left' ? dx : -dx) / w;
			this._applyPosition(startPos + delta, false);
		});

		const finishDrag = (e) => {
			if (e.pointerId !== pointerId) return;
			pointerId = null;
			if (!dragging) return;
			dragging = false;
			try { this.parent.releasePointerCapture(e.pointerId); } catch (_) {}
			// Snap based on the current visual position.
			const m = this.el.style.transform.match(/translateX\(([-\d.]+)%\)/);
			const pct = m ? parseFloat(m[1]) : 0;
			const pos = this.side === 'left' ? 1 + pct / 100 : 1 - pct / 100;
			this._setOpen(pos > SNAP_RATIO);
		};
		on(this.parent, 'pointerup',     finishDrag);
		on(this.parent, 'pointercancel', finishDrag);

		// Esc closes the panel.
		on(document, 'keydown', (e) => {
			if (e.key === 'Escape' && this.isOpen) this.close();
		});

		this._unbind = () => offs.forEach(off => off && off());
	}
}
