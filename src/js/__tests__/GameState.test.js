import GameStateService from '../GameStateService';
import GameState from '../GameState';
import GamePlay from '../GamePlay';
import GameController from '../GameController';

jest.mock('../GameStateService');
jest.mock('../GamePlay');

const testSave = {
	history: [{
		stage: 1,
		turn: 0,
		timer: 0,
		side: 'evil',
		action: 'movePosition',
		from: 1,
		to: 53,
	}, ],
	currentTurn: 3,
	stage: 1,
	timer: 0,
	score: 0,
	boardSize: 4,
	teamSize: {
		good: 1,
		evil: 1,
	},
	initTotalHealth: {
		good: 1000,
		evil: 1000,
	},
	demo: true,
	initialSide: 'evil',
	side: 'evil',
	board: [{
			character: {
				attack: 40,
				defense: 10,
				distance: 4,
				range: 1,
				side: 'evil',
				unitLevel: 1,
				_type: 'undead',
				_helath: 50,
				_level: 1,
			},
			position: 60,
		},
		{
			character: {
				attack: 40,
				defense: 10,
				distance: 4,
				range: 1,
				side: 'good',
				unitLevel: 1,
				_type: 'swordsman',
				_helath: 50,
				_level: 1,
			},
			position: 20,
		},
	],
};

beforeEach(() => {
	jest.resetAllMocks();
});

describe('Testing GameState', () => {
	test('test positive load state', () => {
		const stateService = new GameStateService(localStorage);
		stateService.load.mockReturnValue(testSave);
		const state = new GameState(null, stateService);
		const received = state.state;
		expect(received).toEqual(testSave);
	});

	/* eslint arrow-body-style: ["error", "always"] */
	test('test negative load state', () => {
		GameStateService.mockImplementation(() => {
			return {
				load: () => {
					throw new Error('Test error');
				},
			};
		});
		const stateService = new GameStateService(localStorage);
		const state = new GameState(null, stateService);
		const received = state.state;
		expect(received).toEqual({
			history: []
		});
	});

	test('test call showError method', () => {
		GameStateService.mockImplementation(() => {
			return {
				load: () => {
					throw new Error('Test error');
				},
			};
		});
		const gamePlay = new GamePlay();
		const container = document.createElement('div');
		gamePlay.bindToDOM(container);
		const stateService = new GameStateService(localStorage);
		const gameCtrl = new GameController(gamePlay, stateService);
		expect(gamePlay.showError).toHaveBeenCalled();
	});
});