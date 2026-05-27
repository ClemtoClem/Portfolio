import { isAndroid } from '../core/shell.js';

const STRINGS = {
	'en-US': {
		display:     'Display Mode',
		phone:       'Phone',
		tablet:      'Tablet',
		actualSize:  'Actual size',
		language:    'Language',
		storage:     'Local Storage',
		clearAll:    'Clear All Data',
		empty:       'Nothing stored yet.',
		confirm:     'Are you sure you want to delete all local data?',
		delete:      'Delete',
	},
	'fr-FR': {
		display:     "Mode d'affichage",
		phone:       'Téléphone',
		tablet:      'Tablette',
		actualSize:  'Taille actuelle',
		language:    'Langue',
		storage:     'Stockage Local',
		clearAll:    'Tout effacer',
		empty:       'Rien de stocké pour le moment.',
		confirm:     'Êtes-vous sûr de vouloir supprimer toutes les données locales ?',
		delete:      'Supprimer',
	},
};

const LANGUAGE_OPTIONS = `
	<select id="language-select">
		<option value="en-US">English</option>
		<option value="fr-FR">Français</option>
	</select>`;

function html(s) {
	return `
		<button class="collapsible" data-section="display">${s.display}</button>
		<div class="content" data-section="display">
			<label><input type="radio" name="screen-mode" value="phone"> ${s.phone}</label><br>
			<label><input type="radio" name="screen-mode" value="tablet"> ${s.tablet}</label>
			<p>${s.actualSize}</p>
			<p id="screen-size">-- × -- px</p>
		</div>
		<button class="collapsible">${s.language}</button>
		<div class="content">${LANGUAGE_OPTIONS}</div>
		<button class="collapsible">${s.storage}</button>
		<div class="content">
			<div id="storage-list" class="storage-list"></div>
			<button id="btn-clear-storage" class="btn-clear-all">${s.clearAll}</button>
		</div>
	`;
}

export const parametersApp = {
	id: 'app-parameters',
	title: { 'en-US': 'Parameters', 'fr-FR': 'Paramètres' },
	version: '2.0.0',
	icon: `<svg viewBox="0 0 24 24"><path d="M19.43,12.98c0.04-0.32,0.07-0.64,0.07-0.98s-0.03-0.66-0.07-0.98l2.11-1.65 c0.19-0.15,0.24-0.42,0.12-0.64l-2-3.46c-0.12-0.22-0.39-0.3-0.61-0.22l-2.49,1c-0.52-0.4-1.08-0.73-1.69-0.98l-0.38-2.65 C14.46,2.18,14.25,2,14,2h-4c-0.25,0-0.46,0.18-0.49,0.42L9.13,5.07C8.52,5.32,7.96,5.66,7.44,6.05l-2.49-1 C4.72,4.96,4.46,5.05,4.34,5.27l-2,3.46c-0.13,0.22-0.07,0.49,0.12,0.64l2.11,1.65C4.53,11.34,4.5,11.67,4.5,12s0.03,0.66,0.07,0.98 l-2.11,1.65c-0.19,0.15-0.24,0.42-0.12,0.64l2,3.46c0.12,0.22,0.39,0.3,0.61,0.22l2.49-1c0.52,0.4,1.08,0.73,1.69,0.98l0.38,2.65 C9.54,21.82,9.75,22,10,22h4c0.25,0,0.46-0.18,0.49-0.42l0.38-2.65c0.61-0.25,1.17-0.59,1.69-0.98l2.49,1 c0.23,0.09,0.49,0,0.61-0.22l2-3.46c0.12-0.22,0.07-0.49-0.12-0.64L19.43,12.98z M12,15.5c-1.93,0-3.5-1.57-3.5-3.5 s1.57-3.5,3.5-3.5s3.5,1.57,3.5,3.5S13.93,15.5,12,15.5z"/></svg>`,
	iconColor: '#616161',
	type: 'app',
	style: `
		.app-content { padding: 0; }
		.content {
			padding: 0 18px; margin: 6px 0; max-height: 0; overflow: hidden;
			transition: max-height 0.25s ease-out; background-color: #f9f9f9;
		}
		.storage-list { max-height: 200px; overflow-y: auto; border: 1px solid #ddd; border-radius: 4px; margin: 10px 0; background: #fafafa; }
		.storage-item { display: flex; justify-content: space-between; align-items: center; padding: 8px 10px; border-bottom: 1px solid #ddd; font-size: 0.9em; }
		.storage-item:last-child { border-bottom: none; }
		.storage-info { display: flex; flex-direction: column; overflow: hidden; }
		.storage-key { font-weight: bold; color: #444; font-family: monospace; }
		.storage-val-preview { font-size: 0.8em; color: #888; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 200px; }
		.btn-delete {
			background-color: #ff5252; color: white; border: none; border-radius: 4px;
			width: 24px; height: 24px; cursor: pointer; flex-shrink: 0; margin-left: 10px;
		}
		.btn-clear-all {
			width: 100%; padding: 8px; border: none; border-radius: 4px;
			background-color: #d32f2f; color: white; font-weight: bold;
			cursor: pointer; margin-bottom: 10px;
		}
		.empty-msg { padding: 10px; text-align: center; color: #999; font-style: italic; }
	`,
	content: { 'en-US': html(STRINGS['en-US']), 'fr-FR': html(STRINGS['fr-FR']) },

	onMount(ctx) {
		const strings = STRINGS[ctx.lang] || STRINGS['fr-FR'];
		const screen = document.getElementById('android-screen');

		const screenSizeEl = ctx.$('#screen-size');
		const languageSel  = ctx.$('#language-select');
		const storageList  = ctx.$('#storage-list');
		const clearBtn     = ctx.$('#btn-clear-storage');

		// On Android, the OS frame is in `native-mode` (fullscreen viewport)
		// and the phone/tablet toggle is meaningless — hide the section so
		// users don't expect it to do anything.
		if (isAndroid()) {
			ctx.$$('[data-section="display"]').forEach(el => el.style.display = 'none');
		}

		// Initial state for radios + language
		const currentMode = screen.classList.contains('tablet-mode') ? 'tablet' : 'phone';
		const radio = ctx.$(`input[name='screen-mode'][value='${currentMode}']`);
		if (radio) radio.checked = true;
		languageSel.value = ctx.system.settings.language;

		function updateScreenSize() {
			const r = screen.getBoundingClientRect();
			screenSizeEl.textContent = `${Math.round(r.width)} × ${Math.round(r.height)} px`;
		}

		function renderStorage() {
			storageList.innerHTML = '';
			if (localStorage.length === 0) {
				storageList.innerHTML = `<div class="empty-msg">${strings.empty}</div>`;
				return;
			}
			for (let i = 0; i < localStorage.length; i++) {
				const key = localStorage.key(i);
				const val = localStorage.getItem(key) ?? '';
				const preview = val.length > 30 ? val.slice(0, 30) + '…' : val;
				const item = document.createElement('div');
				item.className = 'storage-item';
				item.innerHTML = `
					<div class="storage-info">
						<span class="storage-key">${key}</span>
						<span class="storage-val-preview" title="${val.replace(/"/g, '&quot;')}">${preview}</span>
					</div>
					<button class="btn-delete" title="${strings.delete}">×</button>`;
				ctx.scope.on(item.querySelector('.btn-delete'), 'click', () => {
					localStorage.removeItem(key);
					renderStorage();
				});
				storageList.appendChild(item);
			}
		}

		ctx.scope.delegate(ctx.root, 'change', "input[name='screen-mode']", (e, input) => {
			const mode = input.value;
			screen.classList.remove('phone-mode', 'tablet-mode');
			screen.classList.add(mode === 'tablet' ? 'tablet-mode' : 'phone-mode');
			ctx.system.setSetting('screenMode', mode);
			updateScreenSize();
		});

		ctx.scope.on(languageSel, 'change', () => {
			ctx.system.setSetting('language', languageSel.value);
			ctx.system.reopenApp(ctx.app.id, ctx.windowId);
		});

		ctx.scope.on(clearBtn, 'click', () => {
			if (confirm(strings.confirm)) {
				localStorage.clear();
				renderStorage();
			}
		});

		// Collapsible accordion
		ctx.scope.delegate(ctx.root, 'click', '.collapsible', (_e, btn) => {
			const content = btn.nextElementSibling;
			const isOpen = !!content.style.maxHeight;
			ctx.$$('.content').forEach(c => c.style.maxHeight = null);
			ctx.$$('.collapsible').forEach(b => b.classList.remove('active'));
			if (!isOpen) {
				btn.classList.add('active');
				content.style.maxHeight = content.scrollHeight + 'px';
			}
		});

		// Sync screen size on resize
		ctx.scope.on(window, 'resize', updateScreenSize);

		updateScreenSize();
		renderStorage();

		return {
			resume:  () => renderStorage(),
			restart: () => { updateScreenSize(); renderStorage(); },
		};
	}
};
