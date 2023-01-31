import maxHealth from './variables';

export const changePlayers = {
	good: 'evil',
	evil: 'good'
};

export function calcTileType(index, board) {
	const len = board.length;
	return board[(index - (index % len)) / len][index % len];
}

export function getCoordinates(pointA, pointB, boardSize) {
	return {
		pointAX: pointA % boardSize,
		pointBX: pointB % boardSize,
		pointAY: Math.floor(pointA / boardSize),
		pointBY: Math.floor(pointB / boardSize),
	};
}

export function distanceMetric(pointA, pointB, boardSize) {
	const {
		pointAX,
		pointBX,
		pointAY,
		pointBY,
	} = getCoordinates(pointA, pointB, boardSize);
	let distance = ((pointAX - pointBX) ** 2 + (pointAY - pointBY) ** 2) ** 0.5;
	if (!Number.isInteger(distance)) {
		distance /= Math.SQRT2;
	}
	return +distance.toFixed(1);
}

export function rangeMetric(pointA, pointB, boardSize) {
	const {
		pointAX,
		pointBX,
		pointAY,
		pointBY,
	} = getCoordinates(pointA, pointB, boardSize);
	const deltaX = Math.abs(pointBX - pointAX);
	const deltaY = Math.abs(pointBY - pointAY);
	return Math.max(deltaX, deltaY);
}

export function getBoard(boardSize) {
	return [
		['top-left', ...Array(boardSize - 2).fill('top'), 'top-right'],
		...Array(boardSize - 2).fill(['left', ...Array(boardSize - 2).fill('center'), 'right']),
		['bottom-left', ...Array(boardSize - 2).fill('bottom'), 'bottom-right'],
	];
}

export function getBoardIndex(boardSize) {
	return Array(boardSize ** 2).fill('').map((_, i) => i);
}

export function getPropagation(index, radius, boardSize) {
	const metric = (element) => distanceMetric(element, index, boardSize);
	return getBoardIndex(boardSize)
		.filter((element) => (element !== index) &&
			metric(element) <= radius &&
			Number.isInteger(metric(element)));
}

export function getRangeArea(index, radius, boardSize) {
	const metric = (element) => rangeMetric(element, index, boardSize);
	return getBoardIndex(boardSize)
		.filter((element) => (element !== index) &&
			metric(element) <= radius);
}

export function getRandomElement(list) {
	return list[Math.floor(Math.random() * list.length)];
}

export function calcHealthLevel(health) {
	if (health < 15) return 'critical';
	if (health < 50) return 'normal';
	return 'high';
}

export function getTotalPropBySide(list, side, prop) {
	return list.filter((element) => element.character.side === side)
		.reduce((acc, element) => acc + element.character[prop], 0);
}

export function getTimer(count) {
	return (new Date(0, 0, 0, 0, 0, count)).toLocaleString(
		'ru', {
			minute: 'numeric',
			second: 'numeric',
		},
	);
}

export function calcDamage(attack, defense) {
	const damage = Math.floor(Math.max(attack - defense, attack * 0.1));
	return (damage < maxHealth) ? damage : maxHealth;
}

export function getAnchorPoint(pointList, boardSize) {
	const col = Math.floor(
		pointList
		.map((element) => element % boardSize)
		.reduce((acc, element) => acc + element) / pointList.length,
	);
	const row = Math.floor(
		pointList
		.map((element) => Math.ceil(element / boardSize))
		.reduce((acc, element) => acc + element) / pointList.length,
	);
	return row * boardSize + col;
}

export function getExtraRestriction(propogation, restriction, initRadius, position, boardSize) {
	const currentRestriction = restriction
		.filter((element) => propogation.includes(element));
	const rowPosition = Math.floor(position / boardSize);
	const colPosition = position % boardSize;
	const extraRestriction = [];
	for (const point of currentRestriction) {
		const rowPoint = Math.floor(point / boardSize);
		const colPoint = point % boardSize;
		const deltaRow = rowPoint - rowPosition;
		const deltaCol = colPoint - colPosition;
		const deltaRowSign = Math.sign(rowPoint - rowPosition);
		const deltaColSign = Math.sign(colPoint - colPosition);
		const deltaPoint = deltaRowSign * boardSize + deltaColSign;
		const radius = Math.abs(deltaRow || deltaCol);
		for (let step = 1; step <= initRadius - radius; step += 1) {
			const nextPoint = point + deltaPoint * step;
			const rowNextPoint = Math.floor(nextPoint / boardSize);
			const deltaRowNextPoint = rowNextPoint - rowPoint;
			const deltaRowNextPointSign = Math.sign(deltaRowNextPoint);
			if (deltaRowNextPointSign === deltaRowSign) {
				extraRestriction.push(nextPoint);
			}
		}
	}
	return extraRestriction;
}

export function getDescription(selfUnit, otherUnit, boardSize) {
	const {
		character: {
			attack: selfAttack,
			defense: selfDefense,
			range: selfRange,
			distance: selfDistance,
			health: selfHealth,
			level: selfLevel,
		},
		position: selfPosition,
	} = selfUnit;
	const {
		character: {
			attack: otherAttack,
			defense: otherDefense,
			range: otherRange,
			health: otherHealth,
		},
		position: otherPosition,
	} = otherUnit;
	const selfDamage = calcDamage(selfAttack, otherDefense);
	const otherDamage = calcDamage(otherAttack, selfDefense);
	const distance = distanceMetric(selfPosition, otherPosition, boardSize);
	const outDistCoef = (distance - otherRange > 0) ? 0 : 1;
	const selfDistCoef = (distance - selfRange > 0) ? 0 : 1;
	const selfKillFactor = (selfHealth - otherDamage < 0) &&
		(otherHealth - selfDamage > 0) ? selfLevel * 10 : 0;
	const possibleAttackRate = selfDamage + 0.1 * (100 - otherHealth);
	const possibleAttackCells = getRangeArea(otherPosition, selfRange, boardSize);
	const possibleMoveCells = getPropagation(selfPosition, selfDistance, boardSize);
	const possibleTarget = possibleMoveCells
		.filter((element) => possibleAttackCells.includes(element));
	const attackRate = possibleAttackRate * selfDistCoef;
	const retreatRate = (otherDamage + 0.1 * (100 - selfHealth) +
		selfKillFactor) * outDistCoef * 0.99;
	const resultRate = Math.max(attackRate, retreatRate);
	return {
		selfPosition,
		otherPosition,
		possibleAttackRate,
		possibleTarget,
		attackRate,
		retreatRate,
		resultRate,
	};
}