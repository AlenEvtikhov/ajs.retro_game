import {
	getRandomElement,
	getDescription,
	distanceMetric,
	getAnchorPoint,
} from './utils';

export default class Estimator {
	constructor(game) {
		this.game = game;
		this.side = this.game.enemySide;
	}

	requestStrategy() {
		if (this.game.demo) {
			if (this.side !== this.game.side) {
				this.smartStrategy();
			} else {
				this.randomStrategy();
			}
		} else {
			this.smartStrategy();
		}
		return null;
	}

	smartStrategy() {
		({
			playerCharacterCells: this.availableCharacter,
			enemyCharacterCells: this.enemyCharacter,
			characterCells: this.allCharacter,
			boardSize: this.boardSize,
		} = this.game);
		this.firingZone = this.getFiringZone();
		if (this.smartAction()) {
			return null;
		} else if (this.expansionStrategy()) {
			return null;
		} else {
			this.smartRandomStrategy();
		}
		return null;
	}

	expansionStrategy() {
		const anchorPoint = getAnchorPoint(this.enemyCharacter, this.boardSize);
		const metric = (point) => distanceMetric(point, anchorPoint, this.boardSize);
		const sortToFar = this.availableCharacter.sort((a, b) => metric(b) - metric(a));
		for (const index of sortToFar) {
			this.game.activatePosition(index);
			const availableCells = this.game.transitionСells;
			if (availableCells.length) {
				const sortToNear = availableCells.sort((a, b) => metric(a) - metric(b));
				const saveCells = sortToNear
					.filter((element) => !this.firingZone.includes(element));
				const moveTarget = saveCells[0];
				if (metric(moveTarget) < metric(index)) {
					this.game.action = this.game.movePosition;
					this.game.tracedAction(moveTarget);
					return true;
				}
			}
		}
		return false;
	}

	getFiringZone() {
		let firingZone = new Set();
		for (const index of this.enemyCharacter) {
			const position = this.game.team.getPositionByIndex(index);
			const dangerCells = position.getAttackArea();
			firingZone = new Set([...dangerCells, ...firingZone]);
		}
		return [...firingZone];
	}

	smartAction() {
		const targetList = [
			...this.getTargetList(this.availableCharacter),
			...this.getTargetList(this.enemyCharacter, true),
		];
		if (targetList.length) {
			const bestTargets = targetList.sort((a, b) => b.resultRate - a.resultRate);
			let prevTarget = {};
			for (const target of bestTargets) {
				const {
					selfPosition,
					otherPosition,
					possibleAttackRate,
					possibleTarget,
					attackRate,
					retreatRate,
					resultRate,
				} = target;
				this.game.activatePosition(selfPosition);
				if (retreatRate > attackRate) {
					const availableCells = this.game.transitionСells;
					const saveCells = availableCells
						.filter((element) => !this.firingZone.includes(element));
					if (saveCells.length) {
						const metric = (point) => distanceMetric(point, otherPosition, this.boardSize);
						const sortToFar = saveCells.sort((a, b) => metric(a) - metric(b));
						const moveTarget = sortToFar[0];
						this.game.action = this.game.movePosition;
						this.game.tracedAction(moveTarget);
						return true;
					} else {
						const rateList = bestTargets
							.map((element) => element.attackRate);
						if (possibleAttackRate > Math.max(...rateList)) {
							const feasibleCells = possibleTarget
								.filter((element) => !this.allCharacter.includes(element));
							const possible = getRandomElement(feasibleCells);
							if (possible) {
								this.game.action = this.game.movePosition;
								this.game.tracedAction(possible);
								return true;
							}
						} else {
							const prevAttackRate = prevTarget.attackRate;
							if (prevAttackRate && prevAttackRate > resultRate) {
								this.game.activatePosition(prevTarget.selfPosition);
								this.game.action = this.game.attackPosition;
								this.game.tracedAction(prevTarget.otherPosition);
								return true;
							}
							prevTarget = target;
						}
					}
				} else {
					this.game.action = this.game.attackPosition;
					this.game.tracedAction(otherPosition);
					return true;
				}
			}
		}
		return false;
	}

	getTargetList(characterList, enemy = false) {
		const targetList = [];
		for (const index of characterList) {
			const selfUnit = this.game.team.getPositionByIndex(index);
			const availableTargets = selfUnit.getAttack();

			for (const target of availableTargets) {
				const otherUnit = this.game.team.getPositionByIndex(target);
				let relevanceDescription = '';
				if (enemy) {
					relevanceDescription = getDescription(otherUnit, selfUnit, this.game.boardSize);
				} else {
					relevanceDescription = getDescription(selfUnit, otherUnit, this.game.boardSize);
				}
				targetList.push(relevanceDescription);
			}
		}
		return targetList;
	}

	smartRandomStrategy() {
		const characterCells = [...this.game.playerCharacterCells]
			.sort(() => Math.random() - 0.5);
		for (const index of characterCells) {
			this.game.activatePosition(index);
			if (this.game.transitionСells.length) {
				const saveCells = this.game.transitionСells
					.filter((element) => !this.firingZone.includes(element));
				const moveTarget = getRandomElement(saveCells);
				if (moveTarget) {
					this.game.action = this.game.movePosition;
					this.game.tracedAction(moveTarget);
					return true;
				} else {
					const dangerMove = getRandomElement(this.game.transitionСells);
					this.game.action = this.game.movePosition;
					this.game.tracedAction(dangerMove);
					return true;
				}
			}
		}
		return false;
	}

	randomStrategy() {
		const characterCells = [...this.game.playerCharacterCells]
			.sort(() => Math.random() - 0.5);
		for (const index of characterCells) {
			this.game.activatePosition(index);
			const moveTarget = getRandomElement(this.game.transitionСells);
			const attackTarget = getRandomElement(this.game.attackСells);
			if (attackTarget) {
				this.game.action = this.game.attackPosition;
			} else if (moveTarget) {
				this.game.action = this.game.movePosition;
			} else {
				continue;
			}
			this.game.tracedAction(attackTarget || moveTarget);
			return true;
		}
		return false;
	}
}