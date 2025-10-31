export const cvApp = {
	id: 'cv-page',
	title: 'Mon CV',
	icon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M19,3H5C3.9,3,3,3.9,3,5v14c0,1.1,0.9,2,2,2h14c1.1,0,2-0.9,2-2V5C21,3.9,20.1,3,19,3z M9,17H7v-5h2V17z M13,17h-2V7h2V17z M17,17h-2v-3h2V17z" /></svg>`,
	iconColor: '#4caf50',
	type: 'main',
	content: `
		<style>
			/* --- Styles CV (Frise) --- */
			.cv-section {
				margin-bottom: 25px;
			}

			.timeline {
				position: relative;
				list-style: none;
				padding: 10px 0;
			}

			.timeline::before {
				content: '';
				position: absolute;
				top: 0;
				left: 15px;
				height: 100%;
				width: 4px;
				background: #e0e0e0;
				border-radius: 2px;
			}

			.timeline-item {
				margin-bottom: 20px;
				padding-left: 40px;
				position: relative;
			}

			.timeline-item:last-child {
				margin-bottom: 0;
			}

			.timeline-dot {
				content: '';
				position: absolute;
				left: 8px;
				top: 4px;
				width: 15px;
				height: 15px;
				border-radius: 50%;
				background: var(--accent-color);
				border: 3px solid var(--app-bg);
			}

			.timeline-date {
				font-weight: 500;
				color: #333;
				margin-bottom: 5px;
				font-size: 0.9em;
			}

			.timeline-content {
				background: #fff;
				padding: 15px;
				border-radius: 8px;
				box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
			}

			.timeline-content h4 {
				margin: 0 0 5px;
				font-size: 1.05em;
				color: var(--text-color);
			}

			.timeline-content p {
				margin: 0;
				font-size: 0.9em;
				color: #666;
			}

			.cv-section ul {
				list-style: none;
				padding-left: 0;
			}

			.cv-section li {
				background: #fff;
				padding: 10px;
				border-radius: 8px;
				margin-bottom: 8px;
				box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
			}
		</style>
		<div class="cv-section">
			<h1>Mon Parcours</h1>
			<div class="timeline">
				<div class="timeline-item">
					<div class="timeline-dot"></div>
					<div class="timeline-date">Avril à Août 2025</div>
					<div class="timeline-content">
						<h4>Stage fin d'étude Ingénieur (Bac+5)</h4>
						<p>Multitel, Mons, Belgique</p>
					</div>
				</div>
				<div class="timeline-item">
					<div class="timeline-dot"></div>
					<div class="timeline-date">2022 à 2025</div>
					<div class="timeline-content">
						<h4>Informatique et Électronique des Systèmes Embarqués</h4>
						<p>PolyTech, Université Grenoble Alpes (UGA)</p>
					</div>
				</div>
				<div class="timeline-item">
					<div class="timeline-dot"></div>
					<div class="timeline-date">Avril à Août 2024</div>
					<div class="timeline-content">
						<h4>Stage d'assistant ingénieur (Bac+4)</h4>
						<p>Laboratoire TIMA</p>
					</div>
				</div>
				<div class="timeline-item">
					<div class="timeline-dot"></div>
					<div class="timeline-date">Juillet à Août 2023</div>
					<div class="timeline-content">
						<h4>CDD (Job d'été)</h4>
						<p>Itancia Eybens, Isère</p>
					</div>
				</div>
				<div class="timeline-item">
					<div class="timeline-dot"></div>
					<div class="timeline-date">Mai à Juillet 2023</div>
					<div class="timeline-content">
						<h4>Stage de technicien (Bac+2)</h4>
						<p>Itancia Eybens, Isère</p>
					</div>
				</div>
				<div class="timeline-item">
					<div class="timeline-dot"></div>
					<div class="timeline-date">Juin à Août 2022</div>
					<div class="timeline-content">
						<h4>CDD (Job d'été)</h4>
						<p>Itancia Eybens, Isère</p>
					</div>
				</div>
				<div class="timeline-item">
					<div class="timeline-dot"></div>
					<div class="timeline-date">Juin à Août 2021</div>
					<div class="timeline-content">
						<h4>CDD (Job d'été)</h4>
						<p>Itancia Eybens, Isère</p>
					</div>
				</div>
				<div class="timeline-item">
					<div class="timeline-dot"></div>
					<div class="timeline-date">Mars à Mai 2022</div>
					<div class="timeline-content">
						<h4>Stage de technicien (Bac+2)</h4>
						<p>Itancia Eybens, Isère</p>
					</div>
				</div>
				<div class="timeline-item">
					<div class="timeline-dot"></div>
					<div class="timeline-date">2020 à 2022</div>
					<div class="timeline-content">
						<h4>Génie Électrique et Informatique Industrielle</h4>
						<p>IUT1 UGA</p>
					</div>
				</div>
				<div class="timeline-item">
					<div class="timeline-dot"></div>
					<div class="timeline-date">Juillet à Août 2020</div>
					<div class="timeline-content">
						<h4>CDD (Job d'été)</h4>
						<p>Carrefour Saint-Égrève, Isère</p>
					</div>
				</div>
			</div>
		</div>
		<div class="cv-section">
			<h1>Mes Diplômes</h1>
			<div class="timeline">
				<div class="timeline-item">
					<div class="timeline-dot"></div>
					<div class="timeline-date">2023</div>
					<div class="timeline-content">
						<h4>Bac+3 - Informatique et électronique des systèmes embarqué</h4>
						<p>PolyTech, Université Grenoble Alpes (UGA)</p>
					</div>
				</div>
				<div class="timeline-item">
					<div class="timeline-dot"></div>
					<div class="timeline-date">2022</div>
					<div class="timeline-content">
						<h4>Bac+2 - Génie Electrique et Informatique industrielle (DUT)</h4>
						<p>Institue Universitaire Technologique 1 (IUT1), Université Grenoble Alpes (UGA)</p>
					</div>
				</div>
				<div class="timeline-item">
					<div class="timeline-dot"></div>
					<div class="timeline-date">2020</div>
					<div class="timeline-content">
						<h4>Baccalauréat série S SVT</h4>
						<p>Lycée Les Eaux Claires de Grenoble</p>
					</div>
				</div>
			</div>
		</div>
		<div class="cv-section">
			<h1>Compétences</h1>
			<ul>
				<li><h4>Électronique (Hardware)</h4><p>Kicad, Conception de circuit logique, Architecture RISCV.</p></li>
				<li><h4>Informatique Embarqué (Firmware)</h4><p>Assembleur RISCV, C, C++, Shell Linux, VHDL, SystemC, Gestion de l'énergie et des ressources, Système temps réel</p></li>
				<li><h4>Informatique (Software)</h4><p>C/C++, Makefile, CMake (SDL3, OpenGL)</p><p>Python (Tkinter, Matplotlib, NumPy, Pandas, Pygame), Lua</p><p>MySQL, Json, XML</p><p>JavaScript, CSS3, HTML5 (NodeJs, Nginx, Jquery)</p><p>Dart (Flutter)</p></li>
				<li><h4>Matériels et Environnements</h4><p>Git, VS Code, KiCad, STM32CubeIDE, Arduino IDE</p><p>STM32/Arduino/Red Pitaya/ESP32</p><p>Linux, Windows, Android</p></li>
			</ul>
		</div>
		<div class="cv-section">
			<h1>Langues</h1>
			<ul>
				<li>Français (Maternelle)</li>
				<li>Anglais (B1)</li>
				<li>Allemand (A2)</li>
			</ul>
		</div>
		<div class="cv-section">
			<h1>Centres d'intérêt</h1>
			<ul>
				<li>Programmation web (NodeJs, Jquery, HTML, JavaScript, CSS)</li>
				<li>Programmation de jeux vidéo (C/C++, GL, glm, SDL3)</li>
				<li>Jeux vidéo (Minetest, OpenArena, etc.)</li>
				<li>Musique (LMMS, Fasttracker 2), Piano (Jazz)</li>
				<li>Dessin</li>
			</ul>
		</div>
	`,
	init: function(windowId) {
		// Pas d'init nécessaire pour cette page statique

		// expose API
		return { pause: () => { }, resume: () => { }, restart: () => { } };
	}
};
