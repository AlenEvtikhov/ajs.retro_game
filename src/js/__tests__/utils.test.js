import {
	getBoard,
	calcTileType
} from '../utils';

const testCaseGetBoard = [
	[4, 0, 0, 'top-left'],
	[4, 0, 1, 'top'],
	[4, 0, 3, 'top-right'],
	[4, 1, 0, 'left'],
	[4, 1, 1, 'center'],
	[4, 1, 3, 'right'],
	[4, 3, 0, 'bottom-left'],
	[4, 3, 1, 'bottom'],
	[4, 3, 3, 'bottom-right'],
	[8, 0, 0, 'top-left'],
	[8, 0, 1, 'top'],
	[8, 0, 7, 'top-right'],
	[8, 1, 0, 'left'],
	[8, 1, 1, 'center'],
	[8, 1, 7, 'right'],
	[8, 7, 0, 'bottom-left'],
	[8, 7, 1, 'bottom'],
	[8, 7, 7, 'bottom-right'],
	[191, 0, 0, 'top-left'],
	[191, 0, 1, 'top'],
	[191, 0, 190, 'top-right'],
	[191, 1, 0, 'left'],
	[191, 1, 1, 'center'],
	[191, 1, 190, 'right'],
	[191, 190, 0, 'bottom-left'],
	[191, 190, 1, 'bottom'],
	[191, 190, 190, 'bottom-right'],
];

const testCaseCalcTileType = [
	[4, 0, 'top-left'],
	[4, 1, 'top'],
	[4, 3, 'top-right'],
	[4, 4, 'left'],
	[4, 5, 'center'],
	[4, 7, 'right'],
	[4, 12, 'bottom-left'],
	[4, 13, 'bottom'],
	[4, 15, 'bottom-right'],
	[8, 0, 'top-left'],
	[8, 1, 'top'],
	[8, 7, 'top-right'],
	[8, 8, 'left'],
	[8, 9, 'center'],
	[8, 15, 'right'],
	[8, 56, 'bottom-left'],
	[8, 57, 'bottom'],
	[8, 63, 'bottom-right'],
	[191, 0, 'top-left'],
	[191, 1, 'top'],
	[191, 190, 'top-right'],
	[191, 191, 'left'],
	[191, 192, 'center'],
	[191, 381, 'right'],
	[191, 36290, 'bottom-left'],
	[191, 36291, 'bottom'],
	[191, 36480, 'bottom-right'],
];

test.each(testCaseGetBoard)(('Test №%#: check element locations, boardSize: %p, i: %p, j: %p, element: %p'),
	(boardSize, i, j, element) => {
		const board = getBoard(boardSize);
		expect(board[i][j]).toBe(element);
	});

test.each(testCaseCalcTileType)(('Test №%#: check element locations, boardSize: %p, index: %p, element: %p'),
	(boardSize, index, element) => {
		const board = getBoard(boardSize);
		expect(calcTileType(index, board)).toBe(element);
	});