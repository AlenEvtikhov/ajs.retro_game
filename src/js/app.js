import GamePlay from './GamePlay';
import GameController from './GameController';
import GameStateService from './GameStateService';

const gamePlay = new GamePlay();
gamePlay.bindToDOM(document.querySelector('#game-container'));

const stateService = new GameStateService(localStorage);

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const gameCtrl = new GameController(gamePlay, stateService);