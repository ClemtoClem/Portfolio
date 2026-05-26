/**
 * Desktop — the swipeable home screen with multiple "pages"
 * (main / apps / games). Renders app icons and lets the user
 * drag through pages with mouse, touch or pen.
 */

import { $, $$, clear } from './dom.js';
import { EventScope } from './events.js';
import { pick } from './i18n.js';

// Pointer must move this many pixels before we treat the gesture as a drag.
// Below the threshold, pointerup is left alone so the browser still fires
// `click` on the original target (dots, app icons).
const DRAG_THRESHOLD = 6;

export class Desktop {
	constructor(system) {
		this.system = system;
		this.scope = new EventScope();

		this.screen          = $('#android-screen');
		this.container       = $('#desktop-container');
		this.wrapper         = $('#desktop-wrapper');
		this.dots            = $$('.dot');
		this.background      = $('.desktop-background');
		this.drawers = {
			main:  $('#app-drawer-main'),
			app:   $('#app-drawer-app'),
			game:  $('#app-drawer-games'),
		};

		this.totalPages = $$('.desktop-page').length;
		this.currentPage = 0;
		this.translate = 0;

		this._dragStartX = 0;
		this._dragging = false;
		this._pointerId = null;
	}

	init() {
		this.scope.delegate(this.wrapper, 'click', '.app-icon', (_e, icon) => {
			const appId = icon.getAttribute('data-app');
			if (appId) this.system.openApp(appId);
		});

		// Pointer drag (replaces mouse + touch listeners)
		this.scope.on(this.container, 'pointerdown', (e) => this._startDrag(e));
		this.scope.on(this.container, 'pointermove', (e) => this._moveDrag(e));
		this.scope.on(this.container, ['pointerup', 'pointercancel', 'pointerleave'], (e) => this._endDrag(e));

		// Flashlight effect
		this.scope.on(this.container, 'mousemove', (e) => this._updateFlashlight(e));
		this.scope.on(this.container, 'mouseleave', () => this._resetFlashlight());

		// Dots
		this.dots.forEach(dot => {
			this.scope.on(dot, 'click', () => {
				this.goToPage(parseInt(dot.dataset.page, 10));
			});
		});

		// Resize keeps the page width in sync
		this.scope.on(window, 'resize', () => this._applyTransform());
		this.scope.on(this.screen, 'change', () => this._applyTransform());

		// Settings changes (language) trigger a re-render
		this.scope.on(this.system, 'settings-change', () => this.render());

		this.render();
		this.goToPage(0, false);
	}

	dispose() { this.scope.dispose(); }

	/** Render app icons into their drawers. Idempotent. */
	render() {
		if (!this.system.consumeSettingsChange()) return;
		Object.values(this.drawers).forEach(clear);

		for (const app of this.system.appRegistry.values()) {
			const title = pick(app.title, this.system.settings.language);
			const drawer = this.drawers[app.type];
			if (!drawer) continue;

			const a = document.createElement('a');
			a.className = 'app-icon';
			a.setAttribute('data-app', app.id);
			a.innerHTML = `
				<div class="icon-bg"${app.iconColor ? ` style="background-color:${app.iconColor}"` : ''}>
					${app.icon}
				</div>
				<span>${title}</span>
			`;
			drawer.appendChild(a);
		}
	}

	goToPage(index, animate = true) {
		this.render();
		if (index < 0) this.currentPage = this.totalPages - 1;
		else if (index >= this.totalPages) this.currentPage = 0;
		else this.currentPage = index;

		this._applyTransform(animate);
		this._updateDots();
	}

	_applyTransform(animate = true) {
		this.wrapper.style.width = `${100 * this.totalPages}%`;
		const pageWidth = this.screen.offsetWidth;
		this.translate = -this.currentPage * pageWidth;
		this.wrapper.style.transition = animate
			? 'transform 0.4s cubic-bezier(0.25, 0.8, 0.25, 1)'
			: 'none';
		this.wrapper.style.transform = `translateX(${this.translate}px)`;
	}

	_updateDots() {
		this.dots.forEach(d => d.classList.toggle('active', parseInt(d.dataset.page, 10) === this.currentPage));
	}

	_startDrag(e) {
		// Only respond to primary mouse button or any touch/pen
		if (e.pointerType === 'mouse' && e.button !== 0) return;
		this._pointerId = e.pointerId;
		this._dragStartX = e.clientX;
		this._dragging = false; // becomes true once we cross DRAG_THRESHOLD
	}

	_moveDrag(e) {
		if (this._pointerId !== e.pointerId) return;
		const diff = e.clientX - this._dragStartX;

		// Promote to a real drag only after a small movement threshold.
		// This keeps clicks on children (dots, app icons) working: until we
		// capture the pointer the browser still synthesises a `click` event
		// on the original target.
		if (!this._dragging) {
			if (Math.abs(diff) < DRAG_THRESHOLD) return;
			this._dragging = true;
			this.wrapper.style.transition = 'none';
			try { this.container.setPointerCapture(e.pointerId); } catch (_) {}
		}

		const pageWidth = this.screen.offsetWidth;
		this.translate = -this.currentPage * pageWidth + diff;
		this.wrapper.style.transform = `translateX(${this.translate}px)`;
	}

	_endDrag(e) {
		if (this._pointerId !== e.pointerId) return;
		this._pointerId = null;
		if (!this._dragging) return;
		this._dragging = false;
		try { this.container.releasePointerCapture(e.pointerId); } catch (_) {}

		const pageWidth = this.screen.offsetWidth;
		const diff = this.translate - (-this.currentPage * pageWidth);
		let next = this.currentPage;
		if (diff < -100) next++;
		else if (diff > 100) next--;
		this.goToPage(next);
	}

	_updateFlashlight(e) {
		const page = e.target.closest('.desktop-page');
		if (!page || !this.background) return;
		const rect = page.getBoundingClientRect();
		this.background.style.setProperty('--mouse-x', `${e.clientX - rect.left}px`);
		this.background.style.setProperty('--mouse-y', `${e.clientY - rect.top}px`);
	}

	_resetFlashlight() {
		if (!this.background) return;
		this.background.style.setProperty('--mouse-x', '-150px');
		this.background.style.setProperty('--mouse-y', '-150px');
	}
}
