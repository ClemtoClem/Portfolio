import { System } from './system.js';

// Importer toutes les applications
import { cvApp 				} from './applications/app-cv.js';
import { projectsApp 		} from './applications/app-projects.js';
import { contactApp 		} from './applications/app-contact.js';
import { weatherApp 		} from './applications/app-weather.js';
import { calculatriceApp    } from './applications/app-calculatrice.js';
import { parametersApp 		} from './applications/app-parameters.js';
import { snakeApp 			} from './applications/game-snake.js';
import { game2048App 		} from './applications/game-2048.js';
import { gameFlappyBirdApp 	} from './applications/game-flappy-bird.js';

// Initialisation du Système
const system = new System();

// Enregistrer les applications
// Main app
system.registerApp(cvApp);
system.registerApp(projectsApp);
system.registerApp(contactApp);
// app
system.registerApp(weatherApp);
system.registerApp(calculatriceApp);
system.registerApp(parametersApp);
// game
system.registerApp(game2048App);
system.registerApp(snakeApp);
system.registerApp(gameFlappyBirdApp);

$(document).ready(function () {
	const $androidScreen    = $("#android-screen");
	const $desktopWrapper   = $('#desktop-wrapper');
	const $desktopContainer = $('#desktop-container');
	const $dots             = $('.dot');

	let currentPage  = 0;
	const totalPages = $('.desktop-page').length;

	// --- Rendu des Icônes d'Applications ---
	const mainDrawer = $('#app-drawer-main');
	const appDrawer  = $('#app-drawer-app');
	const gameDrawer = $('#app-drawer-games');

	for (const [id, app] of system.appRegistry.entries()) {
		const iconHTML = `
			<a class="app-icon" data-app="${id}">
				<div class="icon-bg" style="${app.iconColor ? 'background-color:' + app.iconColor : ''}">
					${app.icon}
				</div>
				<span>${app.title}</span>
			</a>`;
		if      (app.type === 'main') mainDrawer.append(iconHTML);
		else if (app.type === 'app')  appDrawer.append(iconHTML);
		else if (app.type === 'game') gameDrawer.append(iconHTML);
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

	function goToPage(pageIndex, animate = true) {
		$('#desktop-wrapper').css('width', `${100 * totalPages}%`);
		if (pageIndex < 0 || pageIndex >= totalPages) return;
		currentPage = pageIndex;

		const pageWidth = $androidScreen.width();
		currentTranslate = -currentPage * pageWidth;

		$desktopWrapper.css('transition', animate ? 'transform 0.4s cubic-bezier(0.25, 0.8, 0.25, 1)' : 'none');
		$desktopWrapper.css('transform', `translateX(${currentTranslate}px)`);
		updateDots(currentPage);
	}

	function startDrag(e) {
		isDragging = true;
		dragStartX = e.pageX || e.originalEvent.touches[0].pageX;
		$desktopWrapper.css('transition', 'none'); // Désactiver la transition pendant le glissement
	}

	function moveDrag(e) {
		if (!isDragging) return;
		const pageWidth = $androidScreen.width();
		const currentX = e.pageX || e.originalEvent.touches[0].pageX;
		const diffX = currentX - dragStartX;
		currentTranslate = -currentPage * pageWidth + diffX;
		$desktopWrapper.css('transform', `translateX(${currentTranslate}px)`);
	}

	function endDrag(e) {
		if (!isDragging) return;
		isDragging = false;

		const pageWidth = $androidScreen.width();
		const dragThreshold = 100;
		const diffX = currentTranslate - (-currentPage * pageWidth);

		if (diffX < -dragThreshold && currentPage < totalPages - 1) {
			currentPage++;
		} else if (diffX > dragThreshold && currentPage > 0) {
			currentPage--;
		}

		goToPage(currentPage);
	}

	// --- GitHub Pages fix ---
	function githubPageFix() {
		const isGithubPages = window.location.hostname.includes("github.io");
		const repoName = "Portfolio";
		if (!isGithubPages) return;

		const prefix = "/" + repoName + "/";
		const targets = [
			["img", "src"], ["script", "src"], ["link", "href"],
			["video", "src"], ["audio", "src"], ["source", "src"]
		];

		targets.forEach(([tag, attr]) => {
			$(`${tag}[${attr}]`).each(function () {
				const $el = $(this);
				const val = $el.attr(attr);
				if (val && !val.startsWith("http") && !val.startsWith(prefix)) {
					$el.attr(attr, prefix + val.replace(/^\.?\//, ""));
				}
			});
		});

		// fetch + XHR patch
		const originalFetch = window.fetch;
		window.fetch = function (resource, ...args) {
			if (typeof resource === "string" && !resource.startsWith("http") && !resource.startsWith(prefix)) {
				resource = prefix + resource.replace(/^\.?\//, "");
			}
			return originalFetch(resource, ...args);
		};

		const originalOpen = XMLHttpRequest.prototype.open;
		XMLHttpRequest.prototype.open = function (method, url, ...args) {
			if (url && !url.startsWith("http") && !url.startsWith(prefix)) {
				url = prefix + url.replace(/^\.?\//, "");
			}
			return originalOpen.call(this, method, url, ...args);
		};
	}

	// --- Navigation par dots ---
	$dots.on('click', function () {
		const targetPage = parseInt($(this).data('page'));
		goToPage(targetPage);
	});

	// --- Flashlight + drag souris ---
	$desktopContainer.on('mousedown', startDrag);
	$desktopContainer.on('mousemove', moveDrag);
	$desktopContainer.on('mouseup', endDrag);
	$desktopContainer.on('mouseleave', endDrag);

	// --- Support tactile ---
	$desktopContainer.on('touchstart', (e) => startDrag(e.originalEvent));
	$desktopContainer.on('touchmove', (e) => moveDrag(e.originalEvent));
	$desktopContainer.on('touchend', (e) => endDrag(e.originalEvent));

	// --- Effet flashlight ---
	$desktopContainer.on('mousemove', function (e) {
		const page = e.target.closest('.desktop-page');
		if (!page) return;
		const background = $('.desktop-background');
		const rect = page.getBoundingClientRect();
		const x = e.clientX - rect.left;
		const y = e.clientY - rect.top;
		background.css('--mouse-x', `${x}px`);
		background.css('--mouse-y', `${y}px`);
	});

	$desktopContainer.on('mouseleave', function () {
		const background = $('.desktop-background');
		background.css('--mouse-x', '-150px');
		background.css('--mouse-y', '-150px');
	});

	$androidScreen.on("change", "input[name='screen-mode']", function() {
		console.log("resize androidScreen");
		$('#desktop-wrapper').css('width', `${100 * totalPages}%`);
		
		const pageWidth = $androidScreen.width();
		currentTranslate = -currentPage * pageWidth;

		$desktopWrapper.css('transform', `translateX(${currentTranslate}px)`);
	});

	githubPageFix();

	// Initialiser l’état visuel
	goToPage(0, false);
});
