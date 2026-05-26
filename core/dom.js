/**
 * Lightweight DOM helpers replacing jQuery usage in the project.
 * All helpers return vanilla DOM nodes (never wrappers), so chaining
 * stays explicit and there is no hidden state.
 */

export function $(selector, root = document) {
	return root.querySelector(selector);
}

export function $$(selector, root = document) {
	return Array.from(root.querySelectorAll(selector));
}

/**
 * Tagged-template / quick-create helper for HTML strings.
 *  const el = el('<div class="x">hello</div>');
 * Returns the first element node (or a DocumentFragment when several roots).
 */
export function el(html) {
	const tpl = document.createElement('template');
	tpl.innerHTML = String(html).trim();
	const frag = tpl.content;
	if (frag.childElementCount === 1) return frag.firstElementChild;
	return frag;
}

/** Empty a node's children without `innerHTML = ''` re-parsing. */
export function clear(node) {
	if (!node) return;
	while (node.firstChild) node.removeChild(node.firstChild);
}

/** Toggle a class only when boolean differs from current state. */
export function toggleClass(node, name, force) {
	if (!node) return;
	node.classList.toggle(name, force);
}

/** Set inline styles from an object. */
export function setStyles(node, styles) {
	if (!node) return;
	for (const k in styles) node.style[k] = styles[k];
}

/** Smooth fade-out → cb → fade-in (uses CSS opacity, no jQuery). */
export function fadeOut(node, ms = 200) {
	return new Promise(resolve => {
		if (!node) { resolve(); return; }
		node.style.transition = `opacity ${ms}ms ease`;
		node.style.opacity = '0';
		setTimeout(() => { node.style.display = 'none'; resolve(); }, ms);
	});
}

export function fadeIn(node, ms = 200, display = '') {
	return new Promise(resolve => {
		if (!node) { resolve(); return; }
		node.style.display = display;
		node.style.opacity = '0';
		node.style.transition = `opacity ${ms}ms ease`;
		// next frame so the browser registers display change before opacity transition
		requestAnimationFrame(() => {
			node.style.opacity = '1';
			setTimeout(resolve, ms);
		});
	});
}

/** Lightweight visibility toggling (no animation). */
export function show(node, display = '') { if (node) node.style.display = display; }
export function hide(node) { if (node) node.style.display = 'none'; }
