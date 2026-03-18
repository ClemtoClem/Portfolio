/**
 * Registre central des applications.
 * Pour ajouter une nouvelle app : importer son module et l'ajouter à la liste.
 */
import { cvApp          } from './app-cv.js';
import { projectsApp    } from './app-projects.js';
import { contactApp     } from './app-contact.js';
import { weatherApp     } from './app-weather.js';
import { calculatriceApp} from './app-calculatrice.js';
import { musicReaderApp } from './app-music-reader.js';
import { parametersApp  } from './app-parameters.js';
import { game2048App    } from './game-2048.js';
import { gameSnakeApp   } from './game-snake.js';
import { gameChargebotApp  } from './game-chargebot.js';
import { gameFlappyBirdApp } from './game-flappy-bird.js';
import { gameTownFPSApp    } from './game-town-fps.js';

export const ALL_APPS = [
	// Applications principales
	cvApp,
	projectsApp,
	contactApp,
	// Applications utilitaires
	weatherApp,
	calculatriceApp,
	musicReaderApp,
	parametersApp,
	// Jeux
	game2048App,
	gameSnakeApp,
	gameChargebotApp,
	gameFlappyBirdApp,
	gameTownFPSApp,
];
