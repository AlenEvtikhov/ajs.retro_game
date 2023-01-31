import Character, {
	charStats
} from './Character';
import PositionedCharacter from './PositionedCharacter';
import {
	getRandomElement
} from './utils';
import themes from './themes';

export const typeList = Object.keys(charStats)
	.map((type) => class extends Character {
		constructor(level) {
			super(level, type);
		}
	});

/**
 * Generates random characters
 *
 * @param allowedTypes iterable of classes
 * @param maxLevel max character level
 * @returns Character type children (ex. Magician, Bowman, etc)
 */
export function* characterGenerator(maxLevel, characterCount, side) {
	if (typeof maxLevel !== 'number') {
		throw new Error('maxLevel must be a number');
	} else if (typeof characterCount !== 'number') {
		throw new Error('characterCount must be a number');
	}
	let counter = 0;
	while (counter < characterCount) {
		const level = Math.floor(Math.random() * maxLevel) + 1;
		const character = new(getRandomElement(typeList))(level);
		if (character.side === side &&
			character.unitLevel <= level) {
			counter += 1;
			yield character;
		}
	}
}

export function generateTeam(maxLevel, characterCount, side) {
	const generator = characterGenerator(maxLevel, characterCount, side);
	return [...generator];
}

export function generatePosition(characterList, boardSize, playerSide) {
	const location = characterList[0].side === playerSide;
	const rowsNumber = Math.floor(boardSize / 3);
	const restrictor = (_, i) => (location ?
		(i * boardSize) : (i * boardSize + boardSize - rowsNumber));
	const vertLine = Array(boardSize).fill('').map(restrictor);
	let availablePosition = [];
	for (let row = 0; row < rowsNumber; row += 1) {
		availablePosition = [...availablePosition, ...vertLine.map((el) => el + row)];
	}
	const position = availablePosition.sort(() => Math.random() - 0.5)
		.slice(0, characterList.length);
	return characterList.map(
		(character, i) => new PositionedCharacter(character, position[i], boardSize),
	);
}

export function* generateTheme(startTheme = 0) {
	const themeList = Object.keys(themes);
	const start = startTheme % 4;
	const len = themeList.length;
	while (true) {
		for (let i = start; i < len; i += 1) {
			yield themeList[i];
		}
	}
}