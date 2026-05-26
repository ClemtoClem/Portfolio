const TIMELINE_ITEMS = [
	{ date: 'Avril à Août 2025',         title: "Stage fin d'étude Ingénieur",                            place: 'Multitel, Mons, Belgique' },
	{ date: 'Septembre 2022 à Septembre 2025', title: 'Informatique et Électronique des Systèmes Embarqués', place: 'PolyTech, Université Grenoble Alpes (UGA)' },
	{ date: 'Avril à Août 2024',         title: "Stage d'assistant ingénieur",                            place: 'Laboratoire TIMA' },
	{ date: 'Juillet à Août 2023',       title: "CDD (Job d'été)",                                        place: 'Itancia Eybens, Isère' },
	{ date: 'Mai à Juillet 2023',        title: 'Stage de technicien',                                    place: 'Itancia Eybens, Isère' },
	{ date: 'Juin à Août 2022',          title: "CDD (Job d'été)",                                        place: 'Itancia Eybens, Isère' },
	{ date: 'Mars à Mai 2022',           title: 'Stage de technicien',                                    place: 'Itancia Eybens, Isère' },
	{ date: 'Juin à Août 2021',          title: "CDD (Job d'été)",                                        place: 'Itancia Eybens, Isère' },
	{ date: 'Septembre 2020 à Août 2022', title: 'Génie Électrique et Informatique Industrielle',         place: 'IUT1 UGA' },
	{ date: 'Juillet à Août 2020',       title: "CDD (Job d'été)",                                        place: 'Carrefour Saint-Égrève, Isère' },
];

const DIPLOMAS = [
	{ date: '2026 (En attente)', level: 'Bac+5', title: 'Informatique et électronique des systèmes embarqué', place: 'PolyTech, Université Grenoble Alpes (UGA)' },
	{ date: '2023',              level: 'Bac+3', title: 'Informatique et électronique des systèmes embarqué', place: 'PolyTech, Université Grenoble Alpes (UGA)' },
	{ date: '2022',              level: 'Bac+2', title: 'Génie Electrique et Informatique industrielle (DUT)', place: 'Institut Universitaire Technologique 1 (IUT1), Université Grenoble Alpes (UGA)' },
	{ date: '2020',              level: '',      title: 'Baccalauréat série S SVT',                            place: 'Lycée Les Eaux Claires de Grenoble' },
];

const SKILLS = [
	{ heading: 'Électronique (Hardware)',       lines: ['Kicad, Conception de circuit logique, Architecture RISCV.'] },
	{ heading: 'Informatique Embarqué (Firmware)', lines: ["Assembleur RISCV, C, C++, Shell Linux, VHDL, SystemC, Gestion de l'énergie et des ressources, Système temps réel"] },
	{ heading: 'Informatique (Software)',       lines: ['C/C++, Makefile, CMake (SDL3, OpenGL)', 'Python (Tkinter, Matplotlib, NumPy, Pandas, Pygame), Lua', 'MySQL, Json, XML', 'JavaScript, CSS3, HTML5 (NodeJs, Nginx)', 'Dart (Flutter)'] },
	{ heading: 'Matériels et Environnements',   lines: ['Git, VS Code, KiCad, STM32CubeIDE, Arduino IDE', 'STM32/Arduino/Red Pitaya/ESP32', 'Linux, Windows, Android'] },
];

function renderTimeline(items) {
	return `<div class="timeline">${items.map(it => `
		<div class="timeline-item">
			<div class="timeline-dot"></div>
			<div class="timeline-date">${it.date}</div>
			<div class="timeline-content">
				${it.level ? `<h4 style="font-style: italic;">${it.level}</h4>` : ''}
				<h4>${it.title}</h4>
				<p>${it.place}</p>
			</div>
		</div>`).join('')}</div>`;
}

function renderList(items) {
	return `<ul>${items.map(s => `<li><h4>${s.heading}</h4>${s.lines.map(l => `<p>${l}</p>`).join('')}</li>`).join('')}</ul>`;
}

function buildSection(title, body) {
	return `<button class="collapsible">${title}</button><div class="cv-section">${body}</div>`;
}

const CONTENT_FR = [
	buildSection('Mon parcours',  renderTimeline(TIMELINE_ITEMS)),
	buildSection('Mes diplômes',  renderTimeline(DIPLOMAS)),
	buildSection('Mes Compétences', renderList(SKILLS)),
	buildSection('Langues',       '<ul><li>Français (Maternelle)</li><li>Anglais (B1)</li></ul>'),
	buildSection("Mes centres d'intérêt",
		`<ul>
			<li>Programmation web (NodeJs, HTML, JavaScript, CSS)</li>
			<li>Programmation de jeux vidéo (C/C++, OpenGL, glm, SDL3)</li>
			<li>Jeux vidéo (Minetest, OpenArena, etc.)</li>
			<li>Musique (LMMS, Fasttracker 2)</li>
			<li>Dessin, Piano</li>
		</ul>`),
].join('');

const CONTENT_EN = [
	buildSection('Background',    renderTimeline(TIMELINE_ITEMS)),
	buildSection('Diplomas',      renderTimeline(DIPLOMAS)),
	buildSection('Skills',        renderList(SKILLS)),
	buildSection('Languages',     '<ul><li>French (Native)</li><li>English (B1)</li></ul>'),
	buildSection('Interests',
		`<ul>
			<li>Web programming (NodeJs, HTML, JavaScript, CSS)</li>
			<li>Game programming (C/C++, OpenGL, glm, SDL3)</li>
			<li>Video games (Minetest, OpenArena, etc.)</li>
			<li>Music (LMMS, Fasttracker 2)</li>
			<li>Drawing, Piano</li>
		</ul>`),
].join('');

export const cvApp = {
	id: 'app-cv',
	title: { 'en-US': 'My CV', 'fr-FR': 'Mon CV' },
	version: '1.1.0',
	icon: `<svg viewBox="0 0 24 24"><path d="M19,3H5C3.9,3,3,3.9,3,5v14c0,1.1,0.9,2,2,2h14c1.1,0,2-0.9,2-2V5C21,3.9,20.1,3,19,3z M9,17H7v-5h2V17z M13,17h-2V7h2V17z M17,17h-2v-3h2V17z" /></svg>`,
	iconColor: '#4caf50',
	type: 'main',
	style: `
		.app-content { padding: 0; }
		.cv-section {
			padding: 0 18px; margin: 6px 0; max-height: 0; overflow: hidden;
			transition: max-height 0.25s ease-out; background-color: #f9f9f9;
		}
		.cv-section ul { list-style: none; padding-left: 0; }
		.cv-section li {
			background: #fff; padding: 10px; border-radius: 8px;
			margin-bottom: 8px; box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
		}
		.timeline { position: relative; list-style: none; padding: 10px 0; }
		.timeline::before {
			content: ''; position: absolute; top: 0; left: 15px;
			height: 100%; width: 4px; background: #e0e0e0; border-radius: 2px;
		}
		.timeline-item { margin-bottom: 20px; padding-left: 40px; position: relative; }
		.timeline-item:last-child { margin-bottom: 0; }
		.timeline-dot {
			position: absolute; left: 8px; top: 4px; width: 15px; height: 15px;
			border-radius: 50%; background: var(--accent-color); border: 3px solid var(--app-bg);
		}
		.timeline-date { font-weight: 500; color: #333; margin-bottom: 5px; font-size: 0.9em; }
		.timeline-content {
			background: #fff; padding: 15px; border-radius: 8px;
			box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
		}
		.timeline-content h4 { margin: 0 0 5px; font-size: 1.05em; color: var(--text-color); }
		.timeline-content p { margin: 0; font-size: 0.9em; color: #666; }
	`,
	content: { 'en-US': CONTENT_EN, 'fr-FR': CONTENT_FR },

	onMount(ctx) {
		// Collapsible sections — exclusive accordion: opening one auto-collapses
		// any sibling that was open. Simpler and less surprising than the old
		// behaviour where every section opened independently.
		ctx.scope.delegate(ctx.root, 'click', '.collapsible', (_e, btn) => {
			const content = btn.nextElementSibling;
			const isOpen = !!content.style.maxHeight;
			ctx.$$('.cv-section').forEach(s => s.style.maxHeight = null);
			ctx.$$('.collapsible').forEach(b => b.classList.remove('active'));
			if (!isOpen) {
				btn.classList.add('active');
				content.style.maxHeight = content.scrollHeight + 'px';
			}
		});
	}
};
