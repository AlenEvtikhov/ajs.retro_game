import GamePlay from '../GamePlay';
import GameController from '../GameController';
import GameStateService from '../GameStateService';

const gamePlay = new GamePlay();
const container = document.createElement('div');
gamePlay.bindToDOM(container);
const stateService = new GameStateService(localStorage);
const gameCtrl = new GameController(gamePlay, stateService);

gameCtrl.newGame(4, 1, 'good');
gameCtrl.team.positionList[0].position = 0;
gameCtrl.team.positionList[1].position = 5;
gameCtrl.team.updateIndex();
gameCtrl.enemyAction = () => '';

test('Test create PositionedCharacter', () => {
	gameCtrl.onCellEnter(0);
	expect(gameCtrl.action.name).toBe('activatePosition');
});

test('Test create PositionedCharacter', () => {
	gameCtrl.activatePosition(0);
	gameCtrl.onCellEnter(1);
	expect(gameCtrl.action.name).toBe('movePosition');
});

test('Test create PositionedCharacter', () => {
	gameCtrl.activatePosition(0);
	gameCtrl.onCellEnter(5);
	expect(gameCtrl.action.name).toBe('attackPosition');
});

test('Test create PositionedCharacter', () => {
	gameCtrl.activatePosition(0);
	gameCtrl.onCellEnter(7);
	expect(gameCtrl.action.name).toBe('');
});

test('Test create PositionedCharacter', () => {
	gameCtrl.team.positionList[1].position = 15;
	gameCtrl.team.updateIndex();
	gameCtrl.activatePosition(0);
	gameCtrl.onCellEnter(15);
	expect(gameCtrl.action.name).toBe('');
});