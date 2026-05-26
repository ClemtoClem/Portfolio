/**
 * Application module shape.
 *
 * Every app exports an object with this shape:
 *   {
 *     id:          'app-cv',                      // unique id
 *     title:       'My CV' | { 'fr-FR': '...' },  // localised
 *     icon:        '<svg…>',                      // raw SVG markup
 *     iconColor?:  '#xxx',                        // bubble bg color
 *     headerColor?:'#xxx',                        // app header bg
 *     type:        'main' | 'app' | 'game',
 *     version?:    'x.y.z',
 *     style?:      '...css',
 *     content:     '...html' | { 'fr-FR': '...' },
 *     onMount(ctx)                                // lifecycle hook
 *   }
 *
 * `onMount(ctx)` is called once the DOM is inserted. It receives a
 * context object and may return an object with optional `pause`,
 * `resume`, `restart`, `quit` callbacks. The framework automatically
 * cleans every listener/interval/RAF/observer registered through
 * `ctx.scope` when the window closes — no manual cleanup needed.
 *
 *  ctx = {
 *    system,            // System instance
 *    app,               // the app manifest
 *    windowId,          // unique window id
 *    root,              // window root element
 *    content,           // .app-content element
 *    scope,             // EventScope (auto-disposed)
 *    storage,           // Storage scoped to app id
 *    lang,              // current language code
 *    t(value),          // translator helper
 *    $, $$,             // scoped query helpers
 *  }
 */

import { $ as qOne, $$ as qAll } from './dom.js';
import { EventScope } from './events.js';
import { Storage } from './storage.js';
import { pick } from './i18n.js';

export function createAppContext({ system, app, windowId, root, navigator }) {
	const content = root.querySelector('.app-content');
	const scope   = new EventScope();
	const storage = new Storage(app.id);

	return {
		system,
		app,
		windowId,
		root,
		content,
		scope,
		storage,
		navigator,
		get lang() { return system.settings.language; },
		t: (value) => pick(value, system.settings.language),
		$:  (sel) => qOne(sel, root),
		$$: (sel) => qAll(sel, root),
	};
}
