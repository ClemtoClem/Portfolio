export const projectsApp = {
	id: 'projects-page',
	title: 'Projets',
	icon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M4,6H2v14c0,1.1,0.9,2,2,2h14v-2H4V6z M20,2H8C6.9,2,6,2.9,6,4v12c0,1.1,0.9,2,2,2h12c1.1,0,2-0.9,2-2V4C22,2.9,21.1,2,20,2z M12,14.5v-9l6,4.5L12,14.5z" /></svg>`,
	iconColor: '#ff9800',
	type: 'main',
	content: `
		<style>
			/* --- Styles Projets --- */

			#projects-grid {
				display: grid;
				grid-template-columns: repeat(auto-fill, minmax(190px, 1fr));
				gap: 15px;
			}

			.project-card {
				min-width: 190px;
				background: #fff;
				border-radius: 12px;
				overflow: hidden;
				box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
				cursor: pointer;
				transition: transform 0.2s ease, box-shadow 0.2s ease;
			}

			.project-card:hover {
				transform: translateY(-5px);
				box-shadow: 0 5px 15px rgba(0, 0, 0, 0.15);
			}

			.project-card img {
				width: 100%;
				height: 100px;
				object-fit: cover;
				background-color: #eee;
			}

			.project-card-title {
				font-family: 'Undertale', 'Roboto', sans-serif;
				padding: 10px;
				font-weight: 500;
				font-size: 0.8em;
				color: var(--text-color);
			}

			.project-detail-view {
				display: none;
			}

			.project-detail-view .back-to-grid {
				font-family: 'Undertale', 'Roboto', sans-serif;
				display: inline-flex;
				align-items: center;
				cursor: pointer;
				color: var(--accent-color);
				margin-bottom: 20px;
				font-weight: 500;
			}

			.project-detail-view .back-to-grid svg {
				width: 20px;
				height: 20px;
				fill: var(--accent-color);
				margin-right: 5px;
			}

			.project-detail-view .main-image {
				width: 100%;
				max-height: 200px;
				object-fit: cover;
				border-radius: 12px;
				margin-bottom: 15px;
				background-color: #e4e1be;
			}

			.project-detail-view h1 {
				margin: 0;
				font-family: 'Undertale', 'Roboto', sans-serif;
				font-size: 1.2em;
			}

			.project-detail-view p {
				font-weight: normal;
				text-align: justify;
			}

			.project-detail-view .image-with-title {
				width: 80%;
				/* Largeur en fonction du div parent */
				max-width: 500px;
				/* Largeur maximale */
				background-color: #00000000;
				/* Couleur de fond translucide */
				padding-top: 5px;
				/* Padding de 10px de chaque côté */
				margin: 0 auto;
				/* Centre horizontalement */
				display: block;

				/* Nécessaire pour l'effet de centrer avec margin auto */
				img {
					width: 100%;
					height: 100%;
				}
			}

			.project-detail-view .image-title {
				text-align: center;
				font-size: 16px;
				font-style: italic;
				font-weight: bold;
				padding: 0px;
				margin: 0px;
				color: #242424;
			}

			.project-tags {
				margin-bottom: 15px;
			}

			.project-tags .tag {
				display: inline-block;
				background-color: #e0e0e0;
				color: #616161;
				padding: 4px 10px;
				border-radius: 15px;
				font-size: 0.8em;
				margin-right: 5px;
				margin-bottom: 5px;
			}
		</style>
		<!-- Vue Grille des Projets -->
		<div id="projects-page">
			<h1>Mes projets</h1>
			<div id="projects-grid">
				<div class="project-card" data-project="1">
					<img src="./img/polyadventure-capture.png" alt="PolyAdventure">
					<div class="project-card-title">PolyAdventure</div>
				</div>
				<div class="project-card" data-project="2">
					<img src="./img/red-pitaya.png" alt="Red Pitaya">
					<div class="project-card-title">Red Pitaya</div>
				</div>
				<div class="project-card" data-project="3">
					<img src="./img/holonome-robot-capture1.png" alt="Robot Holonome">
					<div class="project-card-title">Robot Holonome</div>
				</div>
				<div class="project-card" data-project="4">
					<img src="./img/batspy_logo.jpg" alt="Gite Chauves-souris">
					<div class="project-card-title">Gite Chauves-souris</div>
				</div>
			</div>
		</div>

		<!-- Vues Détails des Projets (cachées) -->
		<div id="project-detail-1" class="project-detail-view">
			<a class="back-to-grid"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M20,11H7.83l5.59-5.59L12,4l-8,8l8,8l1.41-1.41L7.83,13H20V11z" /></svg> Retour</a>
			<img class="main-image" src="./img/polyadventure-capture.png" alt="PolyAdventure">
			<h1>PolyAdventure</h1>
			<div class="project-tags">
				<span class="tag">C</span>
				<span class="tag">SDL3</span>
				<span class="tag">Jeu 2D</span>
			</div>
			<h4>Description</h4>
			<p>Ce projet, réalisé en 6 semaines à Polytech Grenoble, consistait à créer une application en C. Mon groupe de 5, que j'ai managé, a décidé de développer un jeu de plateau 2D. Pour assurer la meilleure portabilité, j'ai choisi d'utiliser la librairie graphique SDL3. Le jeu, "PolyAdventure", s'inspire des anciens jeux Pokémon, mais avec une plus grande liberté de mouvement.</p>
			<p>J'ai occupé le rôle de lead programmer, développant l'entièreté du moteur du jeu. Pour permettre à mes camarades moins expérimentés de contribuer, j'ai mis en place un système de fichiers de configuration pour paramétrer le jeu, interconnecter les maps et positionner les entités sans avoir à recompiler le code.</p>
		</div>

		<div id="project-detail-2" class="project-detail-view">
			<a class="back-to-grid"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M20,11H7.83l5.59-5.59L12,4l-8,8l8,8l1.41-1.41L7.83,13H20V11z" /></svg> Retour</a>
			<img class="main-image" src="./img/red-pitaya.png" alt="Red Pitaya">
			<h1>Red Pitaya</h1>
			<div class="project-tags">
				<span class="tag">C/C++</span>
				<span class="tag">Traitement du Signal</span>
				<span class="tag">Embarqué</span>
			</div>
			<h4>Description</h4>
			<p>Programmation d'un système universel de mesures des figures de mérites d'un capteur MEMS sur Red Pitaya STEMlab 125-14.</p>
			<p>Le programme compilé à même la Red Pitaya permet de déterminer graphiquement la fréquence de résonance et d'anti-résonance du dispositif. L'application démodule le signal de sortie du dispositif et le signal de référence d’excitation généré par la Red Pitaya et compare les résultats pour en déduire l'amplitude et la phase. Cette étape est répétée pour différentes fréquences d’excitation sur une plage de fréquences paramétrable. Le programme est écrit en C et C++ et utilise la bibliothèque de la Red Pitaya pour gérer ses périphériques et principalement les deux entrées et les deux sorties analogiques hautes performances (125MHz et 14 bits de résolution sur une pleine échelle de ±1V).</p>
			<div class="image-with-title">
				<img src="./img/red-pitaya.png" alt="Red Pitaya">
				<p class="image-title">Red Pitaya</p>
			</div>
		</div>

		<div id="project-detail-3" class="project-detail-view">
			<a class="back-to-grid"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M20,11H7.83l5.59-5.59L12,4l-8,8l8,8l1.41-1.41L7.83,13H20V11z" /></svg> Retour</a>
			<img class="main-image" src="./img/holonome-robot-capture1.png" alt="Robot Holonome">
			<h1>Robot Holonome</h1>
			<div class="project-tags">
				<span class="tag">C</span>
				<span class="tag">KiCad</span>
				<span class="tag">Électronique</span>
			</div>
			<h4>Description</h4>
			<p>Ce projet a été réalisé dans le cadre de ma formation à l'IUT1 de Grenoble. Il consistait à concevoir entièrement un petit robot de notre choix.</p>
			<p>J'ai choisi de développer avec mon équipe un robot autonome capable de se déplacer dans un environnement inconnu, d'un point A à un point B. Pour améliorer la maniabilité, j'ai opté pour un design équipé de trois roues holonomes disposées en triangle équilatéral.</p>
			<p>La première étape du projet consistait à réfléchir aux méthodes de déplacement du robot, à son contrôle, ainsi qu'à sa capacité à naviguer dans un environnement inconnu. J'ai donc conçu la structure du robot et sélectionné les composants électroniques nécessaires à son bon fonctionnement. J'ai également envisagé comment le robot pourrait utiliser des capteurs optiques et des capteurs de distance ultrasonores pour éviter les obstacles.</p>
			<p>Avec ce cahier des charges en tête, j'ai commencé par concevoir un prototype en utilisant des matériaux facilement accessibles, tels que le plastique et des pièces mécaniques. Cela m'a permis de construire un châssis solide et robuste, capable de supporter le poids des moteurs, de la batterie, des capteurs et des cartes électroniques.</p>

			<h4>Réflexion</h4>
			<p>Puisque c'était mon premier projet de ce type, j'ai choisi de concevoir une carte électronique dédiée pour chaque fonction du robot. J'ai réparti les fonctionnalités sur 7 cartes électroniques, ainsi qu'une carte supplémentaire pour la communication avec le robot :</p>
			<ul>
				<li>Une carte d'alimentation</li>
				<li>Une carte de contrôle (l'unité de traitement)</li>
				<li>Une carte de puissance pour contrôler les trois moteurs CC 12V</li>
				<li>Une carte d'interface (comprenant 6 boutons et un écran LCD)</li>
				<li>Une carte d'extension pour connecter les six capteurs (un capteur optique au-dessus de chaque roue et un capteur ultrason entre chaque roue)</li>
				<li>Une carte gyroscope Arduino</li>
				<li>Une carte de communication haute fréquence pour interagir avec un émetteur/récepteur</li>
				<li>Une carte de communication haute fréquence pour échanger des données en RS232 entre un ordinateur et le robot.</li>
			</ul>
			<p>Toutes les cartes électroniques hormis le gyroscope ont été conçues avec le logiciel de conception de circuits imprimés KiCad sous Linux Ubuntu 18.04. KiCad est un logiciel libre et open source, offre une solution simple et intuitive pour la conception de circuits électroniques. Grâce aux équipements disponibles dans mon école, j'ai pu imprimer les cartes électroniques sans passer par une entreprise externe.</p>

			<h4>Conception du châssis</h4>
			<p> Le châssis est conçu pour être robuste et résistant, capable de supporter le poids des moteurs, de la batterie, des capteurs et des cartes électroniques.</p>

			<h4>Conception de la carte d'alimentaiton</h4>
			<p>La carte d'alimentation est conçue pour fournir une alimentation stable et fiable pour les composants électroniques du robot (5V). Elle est alimentée par une batterie Yucel +12V 1.2Ah et est conçue pour fournir une tension continue de +12V. Afin de contrôler le niveau de charge de la batterie, un circuit de surveillance de la tension est intégré à la carte. Le circuit de surveillance de la tension est composé d'un potentiomètre permettant de régler la tension de référence du comparateur. Si cette tension devient inférieur à 10V l'alimentation du circuit est coupée. De plus afin de ne pas tirer trop de courant sur la batterie, un second potentiomètre permet de régler un second circuit qui coupe l'alimentation si le courant dépasse 5A. Le circuit de surveillance est aussi doté d'un fusible de 5A pour protéger des surintensités. Si le circuit de surveillance ne détecte aucune défaillance, un relais est activé pour alimenter un régulateurs de tension LM2937 3.3V et un régulateur de tension LM7805 5V. L'alimentation 12V de la carte de puissance (driver moteur) est aussi contrôlée par ce circuit. Le relais peut aussi être activé manuellement par un interrupteur pour désactiver l'alimentation.</p>
			<p>Liste des composants :</p>
			<ul>
				<li>Deux comparateurs de type LM393</li>
				<li>Deux potentiomètres linéaires (10 kΩ chacun) pour régler les seuils de sous-tension et de surtension.</li>
				<li>Un fusible de 5A</li>
				<li>Un relais 250V 10A (SONGLE SRD-05V DC-SL-C) capable de supporter le courant de la batterie.</li>
				<li>Deux transistors NPN (2N2222) pour piloter le relais.</li>
				<li>Deux diodes de roue libre (1N4007) pour protéger contre les surtensions induites par le relais.</li>
				<li>Divers résistances pour les divisions de tension et le pilotage des transistors.</li>
				<li>Un interrupteur SPST pour déconnecter manuellement la batterie.</li>
				<li>Condensateurs de découplage (ex. 0,1 µF) pour stabiliser les alimentations.</li>
				<li>Un régulateur de tension 5V LM7805</li>
				<li>Un régulateur de tension 3.3V LM2937</li>
			</ul>

			<h4>Conception de la carte d'alimentaiton</h4>
			<p>La carte de contrôle est le cerveau du robot. Elle est chargée de gérer les mouvements du robot, de contrôler les moteurs et de communiquer avec les autres cartes électroniques. Elle est alimentée par une alimentation 5V fournie par la carte d'alimentation. Elle est conçue pour être pilotée par un microcontrôleur PIC18F4431 de Microchip.</p>
			<div class="image-with-title" style="max-width: 160px;">
				<img src="./img/PIC18F4431-J5X-FlipFlop2.avif" alt="PIC18F4431">
				<p class="image-title">PIC18F4431</p>
			</div>

			<h4>Conception de la carte de puissance</h4>
			<p>La carte de puissance est chargée de contrôler les moteurs du robot. Elle est alimentée par une alimentation 12V fournie par la carte d'alimentation. Un driver moteur câblé en pont en H (LD293D Dual H-Bridge) permet de gérer les tensions d'alimentation des moteurs à partir de signaux PWM. Le rapport cyclique du signal permet de modifier la vitesse de rotation du moteur ainsi que son sens de rotation. Le driver moteur est piloté le microcontrôleur génère les trois signaux PWM.<p>
			<div class="image-with-title">
				<img src="./img/LD293D_circuit.gif" alt="LD293D">
				<p class="image-title">Schéma électrique du driver moteur</p>
			</div>
		</div>

		<div id="project-detail-4" class="project-detail-view">
			<a class="back-to-grid"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M20,11H7.83l5.59-5.59L12,4l-8,8l8,8l1.41-1.41L7.83,13H20V11z" /></svg> Retour</a>
			<img class="main-image" src="./img/batspy_logo.jpg" alt="Gite Chauves-souris">
			<h1>Gîte à Chauves-souris Connecté</h1>
			<div class="project-tags">
				<span class="tag">C++</span>
				<span class="tag">Arduino</span>
				<span class="tag">IoT</span>
			</div>
			<h4>Description</h4>
			<p>Ce projet universitaire consiste en la réalisation d'un gîte à chauves-souris équipé d'un système électronique. Le système a pour but de compter les entrées et sorties des chauves-souris et de mesurer les conditions environnementales internes, comme la température, l'humidité et la luminosité, afin d'étudier leur comportement.</p>
			
		</div>
	`,
	init: function (windowId) {
		const $window = $(`#${windowId}`);
		const $projectsPage = $window.find('#projects-page');

		// Ouvrir les détails
		$window.on('click', '.project-card', function () {
			const projectId = $(this).data('project');
			const $detailView = $window.find('#project-detail-' + projectId);

			if ($detailView.length === 0) return; // Sécurité si aucun détail trouvé

			console.log(projectId);
			$projectsPage.fadeOut(200, function () {
				// Cacher toutes les autres vues de détail avant d’afficher celle-ci
				$window.find('.project-detail-view').hide();
				$detailView.fadeIn(200);
			});
		});

		// Retourner à la grille
		$window.on('click', '.back-to-grid', function () {
			const $detailView = $(this).closest('.project-detail-view');
			$detailView.fadeOut(200, function () {
				$projectsPage.fadeIn(200);
			});
		});

		// expose API
		return { pause: () => { }, resume: () => { }, restart: () => { } };
	}

};
