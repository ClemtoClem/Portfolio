/**
 * Calculator app — three modes (normal, scientific, programmer) plus an
 * inline documentation panel for available functions.
 *
 * The expression is evaluated in a sandbox-ish way: function names are
 * substituted by their JS Math equivalent and then `Function` is used to
 * evaluate the resulting code. Inputs never reach raw `eval` and the
 * accepted character set is restricted before evaluation.
 */

const FUNCTIONS = {
	sin:   { args: 'x',           cat: 'Trigonométrie', code: 'TRIG_sin',  desc: 'Sinus (radians ou degrés selon le mode)' },
	cos:   { args: 'x',           cat: 'Trigonométrie', code: 'TRIG_cos',  desc: 'Cosinus' },
	tan:   { args: 'x',           cat: 'Trigonométrie', code: 'TRIG_tan',  desc: 'Tangente' },
	asin:  { args: 'x',           cat: 'Trigonométrie', code: 'Math.asin', desc: 'Arcsinus (radians)' },
	acos:  { args: 'x',           cat: 'Trigonométrie', code: 'Math.acos', desc: 'Arccosinus (radians)' },
	atan:  { args: 'x',           cat: 'Trigonométrie', code: 'Math.atan', desc: 'Arctangente (radians)' },
	ln:    { args: 'x',           cat: 'Logarithmique', code: 'Math.log',   desc: 'Logarithme népérien' },
	log10: { args: 'x',           cat: 'Logarithmique', code: 'Math.log10', desc: 'Logarithme base 10' },
	exp:   { args: 'x',           cat: 'Logarithmique', code: 'Math.exp',   desc: 'Exponentielle' },
	pow10: { args: 'x',           cat: 'Logarithmique', code: 'POW10',      desc: '10^x' },
	round: { args: 'x',           cat: 'Général',       code: 'Math.round', desc: 'Arrondir' },
	sqrt:  { args: 'x',           cat: 'Général',       code: 'Math.sqrt',  desc: 'Racine carrée' },
	cbrt:  { args: 'x',           cat: 'Général',       code: 'Math.cbrt',  desc: 'Racine cubique' },
	abs:   { args: 'x',           cat: 'Général',       code: 'Math.abs',   desc: 'Valeur absolue' },
	rand:  { args: '',            cat: 'Général',       code: 'Math.random',desc: 'Nombre aléatoire entre 0 et 1' },
	fact:  { args: 'n',           cat: 'Probabilité',   code: 'FACT',       desc: 'Factorielle n!' },
	perm:  { args: 'n,k',         cat: 'Probabilité',   code: 'PERM',       desc: 'Permutation P(n,k)' },
	comb:  { args: 'n,k',         cat: 'Probabilité',   code: 'COMB',       desc: 'Combinaison C(n,k)' },
	norm:  { args: 'x,mean,std',  cat: 'Probabilité',   code: 'NORM',       desc: 'Densité loi normale' },
	binom: { args: 'k,n,p',       cat: 'Probabilité',   code: 'BINOM',      desc: 'Loi binomiale' },
	poisson:{ args: 'k,lambda',   cat: 'Probabilité',   code: 'POISSON',    desc: 'Loi de Poisson' },
};

const CONSTANTS = { pi: 'Math.PI', e: 'Math.E' };

// Display-only labels. The actual keypress value (used by the evaluator)
// keeps the original function name from FUNCTIONS — only the rendered text
// is shortened to fit the 6-column phone grid.
const KEY_LABELS = {
	pow10:   '10ˣ',
	exp:     'eˣ',
	sqrt:    '√',
	cbrt:    '∛',
	fact:    'n!',
	abs:     '|x|',
	log10:   'log',
	'x^2':   'x²',
	'x^3':   'x³',
	pi:      'π',
	perm:    'nPk',
	comb:    'nCk',
	norm:    'Norm',
	binom:   'Bin',
	poisson: 'Pois',
	asin:    'sin⁻¹',
	acos:    'cos⁻¹',
	atan:    'tan⁻¹',
};

const LAYOUTS = {
	normal: [
		['DEG', '(',  ')',  '^',  '÷',  'AC'],
		['7',   '8',  '9',  '×',  'C',  'ANS'],
		['4',   '5',  '6',  '-',  '%',  'sqrt'],
		['1',   '2',  '3',  '+',  'ln', 'log10'],
		['0',   '.',  '=',  'pi', 'e',  'rand'],
	],
	scientific: [
		// Core numeric pad (same as normal)
		['DEG', '(',  ')',  '^',   '÷',  'AC'],
		['7',   '8',  '9',  '×',   'C',  'ANS'],
		['4',   '5',  '6',  '-',   '%',  'sqrt'],
		['1',   '2',  '3',  '+',   'ln', 'log10'],
		['0',   '.',  '=',  'pi',  'e',  'rand'],
		// Powers, roots & misc
		['x^2', 'x^3', 'cbrt', 'exp',  'fact', 'abs'],
		// Trigonometry
		['sin', 'cos', 'tan',  'asin', 'acos', 'atan'],
		// Probability + pow10
		['perm','comb','norm', 'binom','poisson','pow10'],
	],
	programmer: [
		['LSH', 'RSH', 'AND', 'OR',  'XOR', 'NOT'],
		['D',   'E',   'F',   'AC',  'C',   '←'],
		['7',   '8',   '9',   'A',   'B',   '='],
		['4',   '5',   '6',   '1',   '2',   '3'],
		['0',   '0',   '0',   '0',   '0',   '0'],
	],
};

// Build a callable evaluator
function buildEvaluator(isRadMode) {
	const helpers = {
		TRIG_sin: (x) => Math.sin(isRadMode() ? x : x * Math.PI / 180),
		TRIG_cos: (x) => Math.cos(isRadMode() ? x : x * Math.PI / 180),
		TRIG_tan: (x) => Math.tan(isRadMode() ? x : x * Math.PI / 180),
		POW10:   (x) => Math.pow(10, x),
		FACT:    (n) => {
			if (!Number.isInteger(n) || n < 0) throw new Error('fact: entier >= 0');
			let r = 1; for (let i = 2; i <= n; i++) r *= i; return r;
		},
		PERM: (n, k) => helpers.FACT(n) / helpers.FACT(n - k),
		COMB: (n, k) => helpers.FACT(n) / (helpers.FACT(k) * helpers.FACT(n - k)),
		NORM: (x, mean = 0, std = 1) => {
			const z = (x - mean) / std;
			return Math.exp(-0.5 * z * z) / (std * Math.sqrt(2 * Math.PI));
		},
		BINOM:   (k, n, p) => helpers.COMB(n, k) * Math.pow(p, k) * Math.pow(1 - p, n - k),
		POISSON: (k, lambda) => Math.pow(lambda, k) * Math.exp(-lambda) / helpers.FACT(k),
	};
	return helpers;
}

function prepareExpression(expr, ANS) {
	// Normalise visual operators
	let safe = String(expr).replace(/×/g, '*').replace(/÷/g, '/').replace(/\^/g, '**');
	// ANS
	safe = safe.replace(/\bans\b/gi, String(ANS));
	// Constants
	for (const [name, code] of Object.entries(CONSTANTS)) {
		safe = safe.replace(new RegExp(`\\b${name}\\b`, 'g'), code);
	}
	// Functions
	for (const [name, def] of Object.entries(FUNCTIONS)) {
		safe = safe.replace(new RegExp(`\\b${name}\\b`, 'g'), `__h.${def.code}`);
	}
	// Now safe should consist only of digits/operators/parens/Math.* and __h.*
	if (/[^0-9+\-*/().,\s\w]/.test(safe)) throw new Error('Caractère invalide');
	return safe;
}

const CONTENT = `
	<div class="calculator" id="calc-root">
		<div class="modes">
			<button class="mode-button" data-mode="normal">Normal</button>
			<button class="mode-button" data-mode="scientific">Sci</button>
			<button class="mode-button" data-mode="programmer">Prog</button>
			<button class="mode-button" id="doc-btn" title="Documentation">?</button>
		</div>
		<div class="bases hidden" id="bases">
			<button class="base-btn" data-base="2">BIN</button>
			<button class="base-btn" data-base="8">OCT</button>
			<button class="base-btn" data-base="10">DEC</button>
			<button class="base-btn" data-base="16">HEX</button>
		</div>
	</div>
	<div class="display">
		<input id="calc-input" autocomplete="off" placeholder="0" />
		<div id="calc-suggestions"></div>
		<div id="calc-result"></div>
	</div>
	<div id="calc-keypad" class="calculator-grid"></div>
	<div id="calc-bases" class="prog-bases hidden">
		<div id="base-dec">DEC: 0</div>
		<div id="base-hex">HEX: 0</div>
		<div id="base-oct">OCT: 0</div>
		<div id="base-bin">BIN: 0</div>
	</div>
	<div id="doc-modal" class="doc-modal hidden">
		<div class="doc-panel">
			<div style="display:flex;gap:8px;margin-bottom:8px;">
				<input id="doc-search" placeholder="Rechercher…" style="flex:1;padding:8px;border-radius:6px;background:#031022;border:1px solid #274060;color:#fff" />
				<button id="doc-close" class="mode-button">Fermer</button>
			</div>
			<div id="doc-content"></div>
		</div>
	</div>
`;

export const calculatriceApp = {
	id: 'app-calculatrice',
	title: { 'en-US': 'Calculator', 'fr-FR': 'Calculatrice' },
	version: '2.0.0',
	icon: `<svg viewBox="0 0 24 24"><rect x="4" y="2" width="16" height="20" rx="2" fill="#7D8792"/><rect x="6" y="4" width="12" height="5" fill="#BFEBFF"/><g fill="#0f4386"><rect x="6"  y="11" width="3" height="3" rx="0.5"/><rect x="10.5" y="11" width="3" height="3" rx="0.5"/><rect x="15" y="11" width="3" height="3" rx="0.5"/><rect x="6"  y="15" width="3" height="3" rx="0.5"/><rect x="10.5" y="15" width="3" height="3" rx="0.5"/><rect x="15" y="15" width="3" height="7" rx="0.5"/><rect x="6"  y="19" width="3" height="3" rx="0.5"/><rect x="10.5" y="19" width="3" height="3" rx="0.5"/></g></svg>`,
	iconColor: '#BEC9D4',
	type: 'app',
	style: `
		.app-content { background: #BEC9D4; padding: 12px; }
		.calculator { color: white; }
		.display { background: #111827; padding: 12px; border-radius: 8px; margin-bottom: 8px; position: relative; }
		#calc-input { width: 100%; background: transparent; border: none; outline: none; color: white; font-size: 1.25rem; }
		#calc-result { text-align: right; font-size: 1.05rem; color: #9CA3AF; min-height: 1.2em; }
		.modes { display: flex; gap: 8px; margin-bottom: 8px; }
		.mode-button { color: white; background: #111827; border: none; padding: 6px 10px; border-radius: 8px; cursor: pointer; }
		.mode-button:hover { background: #2b3747; }
		.mode-button.active { background: #5b21b6; }
		.calculator-grid {
			color: white; display: grid; gap: 6px;
			grid-template-columns: repeat(6, minmax(0, 1fr));
		}
		.calc-key {
			min-width: 0;
			padding: 12px 4px; border-radius: 8px; background: #111827; cursor: pointer;
			text-align: center; user-select: none;
			font-size: clamp(0.7rem, 2.8vw, 1rem);
			overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
		}
		.calc-key:hover { background: #2b3747; }
		.calc-key.disabled { opacity: 0.35; cursor: not-allowed; pointer-events: none; }
		.calc-key.key-num    { background: #0f4386; }
		.calc-key.key-num:hover { background: #295286; }
		.calc-key.key-accent { background: #ea580c; }
		.calc-key.key-red    { background: #b91c1c; }
		.calc-key.key-orange { background: #b45309; }
		#calc-suggestions {
			position: absolute; background: #0f172a; border: 1px solid #334155;
			border-radius: 6px; max-height: 200px; overflow: auto; min-width: 220px;
			display: none; z-index: 50; top: 100%; left: 0;
		}
		.suggestion-item { color: white; padding: 8px 10px; cursor: pointer; }
		.suggestion-item:hover { background: #111827; }
		.invalid-function { color: #ef4444 !important; }
		.bases { display: flex; gap: 6px; align-items: center; margin-bottom: 8px; }
		.base-btn { color: white; border: none; padding: 6px 10px; border-radius: 6px; cursor: pointer; background: #1f2937; }
		.base-btn.active { background: #5b21b6; }
		.prog-bases { color: #111; background: #f1f5f9; padding: 8px; border-radius: 8px; margin-top: 8px; font-family: monospace; }
		.hidden { display: none !important; }
		.doc-modal { position: absolute; inset: 0; background: rgba(2,6,23,0.6); display: flex; align-items: center; justify-content: center; z-index: 100; }
		.doc-panel { width: min(900px, 96%); max-height: 80vh; overflow: auto; background: #0b1220; padding: 16px; border-radius: 10px; color: white; }
		.doc-entry { margin-bottom: 8px; border-radius: 6px; padding: 8px; background: #071126; }
	`,
	content: CONTENT,

	onMount(ctx) {
		const input    = ctx.$('#calc-input');
		const result   = ctx.$('#calc-result');
		const keypad   = ctx.$('#calc-keypad');
		const auto     = ctx.$('#calc-suggestions');
		const docModal = ctx.$('#doc-modal');
		const docContent = ctx.$('#doc-content');
		const docSearch  = ctx.$('#doc-search');
		const basesBar = ctx.$('#bases');
		const progBases= ctx.$('#calc-bases');

		let mode = 'normal';
		let base = 10;
		let isRadMode = true;
		let expression = '';
		let ANS = 0;
		const helpers = buildEvaluator(() => isRadMode);

		// ── Display ──────────────────────────────────────────
		function evaluate() {
			if (!expression) return '';
			try {
				if (mode === 'programmer') {
					const v = parseInt(expression, base);
					if (Number.isNaN(v)) throw new Error();
					updateProgBases(v);
					ANS = v;
					return formatResult(v);
				}
				const prepared = prepareExpression(expression, ANS);
				// eslint-disable-next-line no-new-func
				const fn = new Function('__h', `return (${prepared});`);
				let r = fn(helpers);
				if (typeof r === 'function') r = r();
				if (!Number.isFinite(r)) throw new Error();
				ANS = Number(r);
				return formatResult(ANS);
			} catch {
				return 'Erreur';
			}
		}

		function formatResult(v) {
			if (typeof v !== 'number') return String(v);
			return String(parseFloat(v.toFixed(10)));
		}

		function checkAutocomplete() {
			const m = expression.match(/([a-zA-Z][a-zA-Z0-9_]*)$/);
			auto.innerHTML = '';
			if (!m) { auto.style.display = 'none'; input.classList.remove('invalid-function'); return; }
			const typed = m[1].toLowerCase();
			const candidates = Object.keys(FUNCTIONS).filter(k => k.startsWith(typed))
				.concat(Object.keys(CONSTANTS).filter(k => k.startsWith(typed)));
			if (!candidates.length) {
				input.classList.add('invalid-function');
				auto.style.display = 'none';
				return;
			}
			input.classList.remove('invalid-function');
			for (const name of candidates) {
				const def = FUNCTIONS[name];
				const html = def
					? `<div class="suggestion-item">${name}(${def.args}) — <span style="color:#9CA3AF">${def.cat}</span></div>`
					: `<div class="suggestion-item">${name}</div>`;
				const item = document.createElement('div');
				item.innerHTML = html;
				const node = item.firstChild;
				ctx.scope.on(node, 'click', () => {
					expression = expression.replace(/([a-zA-Z][a-zA-Z0-9_]*)$/, def ? `${name}(` : name);
					render();
					auto.style.display = 'none';
					input.focus();
				});
				auto.appendChild(node);
			}
			auto.style.display = 'block';
		}

		function render() {
			input.value = expression;
			result.textContent = evaluate();
			if (mode !== 'programmer') checkAutocomplete();
			else auto.style.display = 'none';
		}

		function updateProgBases(decValue) {
			const v = Number.isFinite(decValue) ? Math.floor(Math.max(0, decValue)) : 0;
			ctx.$('#base-dec').textContent = 'DEC: ' + v;
			ctx.$('#base-hex').textContent = 'HEX: ' + v.toString(16).toUpperCase();
			ctx.$('#base-oct').textContent = 'OCT: ' + v.toString(8);
			ctx.$('#base-bin').textContent = 'BIN: ' + v.toString(2);
		}

		// ── Keypad ───────────────────────────────────────────
		function buildKey(content) {
			const btn = document.createElement('div');
			btn.className = 'calc-key';
			btn.dataset.value = content;
			btn.textContent = KEY_LABELS[content] ?? content;
			if (mode === 'programmer') {
				if (/^[0-9]$/.test(content) && parseInt(content, 10) >= base) btn.classList.add('disabled');
				if (/^[A-F]$/.test(content) && base < 16) btn.classList.add('disabled');
				if (content === '.') btn.classList.add('disabled');
			}
			if (/^[0-9]$/.test(content) || /^[A-F]$/.test(content)) btn.classList.add('key-num');
			if (content === '=') btn.classList.add('key-accent');
			if (content === 'ANS') btn.classList.add('key-orange');
			if (content === 'DEG' || content === 'RAD') btn.classList.add('key-red');
			ctx.scope.on(btn, 'click', () => handleKey(content));
			return btn;
		}

		function renderKeypad() {
			keypad.innerHTML = '';
			const layout = LAYOUTS[mode];
			for (const row of layout) for (const k of row) keypad.appendChild(buildKey(k));
			basesBar.classList.toggle('hidden', mode !== 'programmer');
			progBases.classList.toggle('hidden', mode !== 'programmer');
			if (mode === 'programmer') updateProgBases(0);
		}

		function switchMode(next) {
			mode = next;
			expression = '';
			isRadMode = true;
			ctx.$$('.mode-button').forEach(b => b.classList.toggle('active', b.dataset.mode === mode));
			renderKeypad();
			render();
		}

		function setBase(b) {
			if (expression) {
				const dec = parseInt(expression, base);
				if (!Number.isNaN(dec)) expression = dec.toString(b).toUpperCase();
			}
			base = b;
			ctx.$$('.base-btn').forEach(btn => btn.classList.toggle('active', +btn.dataset.base === base));
			renderKeypad();
			render();
		}

		function toggleDegRad() {
			isRadMode = !isRadMode;
			ctx.$$('.calc-key[data-value="DEG"], .calc-key[data-value="RAD"]').forEach(b => {
				b.textContent = isRadMode ? 'DEG' : 'RAD';
				b.dataset.value = isRadMode ? 'DEG' : 'RAD';
			});
		}

		function handleKey(value) {
			if (mode === 'programmer') {
				if (['BIN','OCT','DEC','HEX'].includes(value)) {
					setBase({ BIN: 2, OCT: 8, DEC: 10, HEX: 16 }[value]);
					return;
				}
				if (value === 'AC' || value === 'C') { expression = ''; render(); return; }
				if (value === '←')  { expression = expression.slice(0, -1); render(); return; }
				if (value === '=')  return;
				if (/^(LSH|RSH|AND|OR|XOR|NOT)$/.test(value)) {
					let dec = expression ? parseInt(expression, base) : 0;
					if (Number.isNaN(dec)) dec = 0;
					if (value === 'NOT') {
						dec = (~dec) >>> 0;
					} else {
						const s = prompt(value === 'LSH' || value === 'RSH' ? 'Nombre de bits' : `Second opérande (base ${base})`);
						if (s === null) return;
						const v = parseInt(s, value === 'LSH' || value === 'RSH' ? 10 : base);
						if (Number.isNaN(v)) return;
						if (value === 'LSH') dec = dec << v;
						else if (value === 'RSH') dec = dec >> v;
						else if (value === 'AND') dec = dec & v;
						else if (value === 'OR')  dec = dec | v;
						else if (value === 'XOR') dec = dec ^ v;
					}
					expression = dec.toString(base).toUpperCase();
					render();
					return;
				}
				if (expression === '0') expression = '';
				expression += value;
				render();
				return;
			}

			switch (value) {
				case 'ANS': expression += String(ANS); break;
				case 'AC':  expression = ''; break;
				case 'C':   expression = expression.slice(0, -1); break;
				case '=': {
					const out = evaluate();
					if (out !== 'Erreur') { expression = out; result.textContent = ''; }
					break;
				}
				case 'x^2': expression += '**2'; break;
				case 'x^3': expression += '**3'; break;
				case '^':   expression += '^'; break;
				case 'DEG': case 'RAD': toggleDegRad(); break;
				case '÷': case '×': case '-': case '+': case '(': case ')': case '%': case '.': case 'pi': case 'e':
					expression += value; break;
				default:
					if (FUNCTIONS[value]) expression += `${value}(`;
					else if (expression === '0' || expression === '') expression = value;
					else expression += value;
			}
			render();
		}

		// ── Doc panel ────────────────────────────────────────
		function renderDoc(filter = '') {
			docContent.innerHTML = '';
			const grouped = {};
			for (const [name, def] of Object.entries(FUNCTIONS)) {
				if (filter && !(name.includes(filter) || def.desc.toLowerCase().includes(filter))) continue;
				(grouped[def.cat] ||= []).push({ name, ...def });
			}
			for (const [cat, items] of Object.entries(grouped)) {
				const h = document.createElement('h3');
				h.style.color = '#7dd3fc';
				h.textContent = cat;
				docContent.appendChild(h);
				for (const it of items) {
					const entry = document.createElement('div');
					entry.className = 'doc-entry';
					entry.innerHTML = `<b>${it.name}(${it.args})</b><div style="color:#9CA3AF">${it.desc}</div>`;
					docContent.appendChild(entry);
				}
			}
		}

		// ── Wiring ───────────────────────────────────────────
		ctx.scope.delegate(ctx.root, 'click', '.mode-button', (_e, btn) => {
			const m = btn.dataset.mode;
			if (m) switchMode(m);
		});
		ctx.scope.on(ctx.$('#doc-btn'), 'click', () => {
			renderDoc('');
			docModal.classList.remove('hidden');
		});
		ctx.scope.on(ctx.$('#doc-close'), 'click', () => docModal.classList.add('hidden'));
		ctx.scope.on(docSearch, 'input', () => renderDoc(docSearch.value.trim().toLowerCase()));
		ctx.scope.delegate(ctx.root, 'click', '.base-btn', (_e, btn) => setBase(parseInt(btn.dataset.base, 10)));
		ctx.scope.on(input, 'input', () => { expression = input.value; render(); });
		ctx.scope.on(document, 'click', (e) => {
			if (!auto.contains(e.target) && e.target !== input) auto.style.display = 'none';
		});

		switchMode('normal');

		return { restart: () => { expression = ''; render(); } };
	}
};
