/**
 * Registry of every app module shipped with the OS.
 * To add a new app: import its module here and append it to ALL_APPS.
 */
import { cvApp }              from './app-cv.js';
import { projectsApp }        from './app-projects.js';
import { contactApp }         from './app-contact.js';
import { weatherApp }         from './app-weather.js';
import { calculatriceApp }    from './app-calculatrice.js';
import { musicReaderApp }     from './app-music-reader.js';
import { parametersApp }      from './app-parameters.js';
import { game2048App }        from './game-2048.js';
import { gameSnakeApp }       from './game-snake.js';
import { gameChargebotApp }   from './game-chargebot.js';
import { gameFlappyBirdApp }  from './game-flappy-bird.js';
import { gameTownFPSApp }     from './game-town-fps.js';

export const ALL_APPS = [
	cvApp,
	projectsApp,
	contactApp,
	weatherApp,
	calculatriceApp,
	musicReaderApp,
	parametersApp,
	game2048App,
	gameSnakeApp,
	gameChargebotApp,
	gameFlappyBirdApp,
	gameTownFPSApp,
];
