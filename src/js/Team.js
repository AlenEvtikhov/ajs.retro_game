import {
	getTotalPropBySide,
	changePlayers
} from './utils';

export default class Team {
	constructor(positionList) {
		this.positionList = positionList;
		this.init();
	}

	init() {
		this.statistics = {};
		this.initTotalHealth = {};
		this.teamSize = {};
		this.sideIndex = {};
		this.allIndex = 0;
		this.currentTurn = 0;
		this.gameStage = 0;
		this.positionList.map((element) => element.team = this);
		this.updateIndex();

		for (const side in changePlayers) {
			if (Object.prototype.hasOwnProperty.call(changePlayers, side)) {
				this.initTotalHealth[side] = this.getTotalHealth(side);
				this.teamSize[side] = this.sideIndex[side].length;
			}
		}
	}

	updateIndex() {
		this.sideIndex.evil = this.getTeamPosition('evil');
		this.sideIndex.good = this.getTeamPosition('good');
		this.allIndex = [...this.sideIndex.evil, ...this.sideIndex.good];
	}

	*[Symbol.iterator]() {
		this.positionList = this.positionList
			.filter((element) => element.character.health > 0);
		this.updateIndex();
		this.calcStatistics();
		for (const position of this.positionList) {
			yield position;
		}
	}

	getTeamPosition(side) {
		return this.positionList
			.map((element) => element.character.side === side && element.position)
			.filter((element) => element !== false);
	}

	getCharacters() {
		return this.positionList
			.map((element) => element.character);
	}

	getPositionByIndex(index) {
		return this.positionList.find((el) => el.position === index);
	}

	getTotalHealth(side) {
		return getTotalPropBySide(this.positionList, side, 'health');
	}

	totalLevelUp() {
		this.positionList
			.forEach((element) => element.character.levelUp());
	}

	calcStatistics() {
		this.statistics = {
			currentTurn: this.currentTurn,
			gameStage: this.gameStage,
			score: this.score,
			highscore: this.highscore,
		};
		for (const side in changePlayers) {
			if (Object.prototype.hasOwnProperty.call(changePlayers, side)) {
				const numberCharacters = this.sideIndex[side].length;
				const numberCharactersEnemy = this.sideIndex[changePlayers[side]].length;
				const totalHealth = this.getTotalHealth(side);
				const currTotalHealthEnemy = this.getTotalHealth(changePlayers[side]);
				const totalDamage = this.initTotalHealth[changePlayers[side]] - currTotalHealthEnemy;

				this.statistics[side] = {
					numberCharacters,
					totalHealth,
					totalDamage,
					charactersKilled: this.teamSize[side] - numberCharacters,
					enemiesKilled: this.teamSize[changePlayers[side]] - numberCharactersEnemy,
				};
			}
		}
	}
}