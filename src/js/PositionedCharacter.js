import Character from './Character';
import {
	getPropagation,
	getRangeArea,
	getExtraRestriction,
	changePlayers,
} from './utils';

export default class PositionedCharacter {
	constructor(character, position, boardSize) {
		if (!(character instanceof Character)) {
			throw new Error('character must be instance of Character or its children');
		}

		if (typeof position !== 'number') {
			throw new Error('position must be a number');
		}

		if (typeof boardSize !== 'number') {
			throw new Error('boardSize must be a number');
		}

		this.character = character;
		this.position = position;
		this.boardSize = boardSize;
		this.team = '';
	}

	getTransition() {
		const {
			distance
		} = this.character;
		const {
			position,
			boardSize
		} = this;
		const propogation = getPropagation(this.position, distance, this.boardSize);
		const restriction = this.team.allIndex;
		const extraRestriction = getExtraRestriction(
			propogation,
			restriction,
			distance,
			position,
			boardSize,
		);
		return propogation
			.filter((element) => !restriction.includes(element))
			.filter((element) => !extraRestriction.includes(element));
	}

	getAttackArea() {
		const {
			range
		} = this.character;
		return getRangeArea(this.position, range, this.boardSize);
	}

	getAttack() {
		const enemySide = changePlayers[this.character.side];
		const enemyCells = this.team.sideIndex[enemySide];
		const attackArea = this.getAttackArea();
		return attackArea.filter((element) => enemyCells.includes(element));
	}

	getMessage() {
		return `\u{1F396} ${this.character.level}` +
			`\n\u{2694} ${this.character.attack}` +
			`\n\u{1F6E1} ${this.character.defense}` +
			`\n\u{2764} ${this.character.health}`;
	}
}