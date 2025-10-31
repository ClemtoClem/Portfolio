import { System } from './system.js';

// Importer toutes les applications
import { cvApp 				} from './applications/app-cv.js';
import { projectsApp 		} from './applications/app-projects.js';
import { contactApp 		} from './applications/app-contact.js';
import { weatherApp 		} from './applications/app-weather.js';
import { parametersApp 		} from './applications/app-parameters.js';
import { snakeApp 			} from './applications/game-snake.js';
import { game2048App 		} from './applications/game-2048.js';
import { gameFlappyBirdApp 	} from './applications/game-flappy-bird.js';

// Initialisation du Système
const system = new System();

// Enregistrer les applications
system.registerApp(cvApp);
system.registerApp(projectsApp);
system.registerApp(contactApp);
system.registerApp(weatherApp);
system.registerApp(parametersApp);
system.registerApp(game2048App);
system.registerApp(snakeApp);
system.registerApp(gameFlappyBirdApp);

$(document).ready(function () {
	const $desktopWrapper = $('#desktop-wrapper');
	const $desktopContainer = $('#desktop-container');
	const $dots = $('.dot');

	let currentPage = 0;
	const totalPages = 2;

	// --- Rendu des Icônes d'Applications ---
	const mainDrawer = $('#app-drawer-main');
	const gameDrawer = $('#app-drawer-games');

	for (const [id, app] of system.appRegistry.entries()) {
		const iconHTML = `
			<a class="app-icon" data-app="${id}">
				<div class="icon-bg" style="${app.iconColor ? 'background-color:' + app.iconColor : ''}">
					${app.icon}
				</div>
				<span>${app.title}</span>
			</a>`;

		if (app.type === 'main') {
			mainDrawer.append(iconHTML);
		} else if (app.type === 'game') {
			gameDrawer.append(iconHTML);
		}
	}

	// --- Horloge de la barre de statut ---
	function updateTime() {
		const now = new Date();
		const hours = String(now.getHours()).padStart(2, '0');
		const minutes = String(now.getMinutes()).padStart(2, '0');
		$('#time').text(`${hours}:${minutes}`);
	}
	updateTime();
	setInterval(updateTime, 10000);

	// --- Gestion de l'ouverture des applications (via délégation) ---
	$desktopWrapper.on('click', '.app-icon', function () {
		const appId = $(this).data('app');
		system.openApp(appId);
	});

	// --- Logique de Swipe du Bureau ---
	let dragStartX = 0;
	let currentTranslate = 0;
	let isDragging = false;

	function updateDots(page) {
		$dots.removeClass('active');
		$dots.filter(`[data-page="${page}"]`).addClass('active');
	}

	function startDrag(e) {
		isDragging = true;
		dragStartX = e.pageX || e.originalEvent.touches[0].pageX;
		$desktopWrapper.css('transition', 'none'); // Désactiver la transition pendant le glissement
	}

	function moveDrag(e) {
		if (!isDragging) return;
		const pageWidth = $desktopContainer.width();
		const currentX = e.pageX || e.originalEvent.touches[0].pageX;
		const diffX = currentX - dragStartX;
		currentTranslate = -currentPage * pageWidth + diffX;
		$desktopWrapper.css('transform', `translateX(${currentTranslate}px)`);
	}

	function endDrag(e) {
		if (!isDragging) return;
		isDragging = false;
		$desktopWrapper.css('transition', 'transform 0.4s cubic-bezier(0.25, 0.8, 0.25, 1)');

		const pageWidth = $desktopContainer.width();
		const dragThreshold = pageWidth / 4; // Seuil de 25%
		const diffX = currentTranslate - (-currentPage * pageWidth);

		if (diffX < -dragThreshold && currentPage < totalPages - 1) {
			// Glisser vers la page suivante
			currentPage++;
		} else if (diffX > dragThreshold && currentPage > 0) {
			// Glisser vers la page précédente
			currentPage--;
		}

		// Animer vers la position de la page finale
		currentTranslate = -currentPage * pageWidth;
		$desktopWrapper.css('transform', `translateX(${currentTranslate}px)`);
		updateDots(currentPage);
	}

	function adaptRequestURL() {
		const isGithubPages = window.location.hostname.includes("github.io");
		const repoName = "Portfolio";

		if (!isGithubPages) return;

		const prefix = "/" + repoName + "/";

		// Balises à corriger et attributs associés
		const targets = [
			["img", "src"],
			["script", "src"],
			["link", "href"],
			["video", "src"],
			["audio", "src"],
			["source", "src"]
		];

		$.each(targets, function (_, pair) {
			const tag = pair[0];
			const attr = pair[1];

			$(`${tag}[${attr}]`).each(function () {
				const $el = $(this);
				const val = $el.attr(attr);
				if (val && !val.startsWith("http") && !val.startsWith(prefix)) {
					$el.attr(attr, prefix + val.replace(/^\.?\//, ""));
				}
			});
		});

		// Interception de fetch()
		const originalFetch = window.fetch;
		window.fetch = function (resource, ...args) {
			if (typeof resource === "string" && !resource.startsWith("http") && !resource.startsWith(prefix)) {
				resource = prefix + resource.replace(/^\.?\//, "");
			}
			return originalFetch(resource, ...args);
		};

		// Interception de XMLHttpRequest
		const originalOpen = XMLHttpRequest.prototype.open;
		XMLHttpRequest.prototype.open = function (method, url, ...args) {
			if (url && !url.startsWith("http") && !url.startsWith(prefix)) {
				url = prefix + url.replace(/^\.?\//, "");
			}
			return originalOpen.call(this, method, url, ...args);
		};
	}

	// Écouteurs pour la souris
	$desktopContainer.on('mousedown', startDrag);
	//$desktopContainer.on('mousemove', moveDrag);
	$desktopContainer.on('mouseup', endDrag);
	//$desktopContainer.on('mouseleave', endDrag); // Annuler si la souris quitte

	// Écouteurs pour le tactile
	$desktopContainer.on('touchstart', (e) => startDrag(e.originalEvent));
	$desktopContainer.on('touchmove', (e) => moveDrag(e.originalEvent));
	$desktopContainer.on('touchend', (e) => endDrag(e.originalEvent));

	// Logique du Flashlight et du drag
	$desktopContainer.on('mousemove', function (e) {
		moveDrag(e);

		// Seuls les 'desktop-page' sont affectés
		const page = e.target.closest('.desktop-page');
		if (!page) return;
		const background = $('.desktop-background');

		const rect = page.getBoundingClientRect();
		// Coordonnées de la souris relatives à l'élément 'page'
		const x = e.clientX - rect.left;
		const y = e.clientY - rect.top;

		// Mettre à jour les variables CSS
		background.css('--mouse-x', `${x}px`);
		background.css('--mouse-y', `${y}px`);
	});

	$desktopContainer.on('mouseleave', function (e) {
		endDrag(e);

		// Cacher le flashlight quand la souris quitte la zone du bureau
		const background = $('.desktop-background');
		// Réinitialise à la position par défaut (cachée)
		background.css('--mouse-x', '-150px');
		background.css('--mouse-y', '-150px');
	});

	// code portable (dev local + GitHub Pages)
	adaptRequestURL();
});
