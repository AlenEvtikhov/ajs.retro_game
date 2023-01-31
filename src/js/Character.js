import maxHealth from './variables';
import {
	calcDamage
} from './utils';

export const charStats = {
	bowman: {
		attack: 25,
		defence: 25,
		distance: 2,
		range: 2,
		unitLevel: 1,
		side: 'good',
	},
	swordsman: {
		attack: 40,
		defence: 10,
		distance: 4,
		range: 1,
		unitLevel: 1,
		side: 'good',
	},
	magician: {
		attack: 10,
		defence: 40,
		distance: 1,
		range: 4,
		unitLevel: 2,
		side: 'good',
	},
	vampire: {
		attack: 25,
		defence: 25,
		distance: 2,
		range: 2,
		unitLevel: 1,
		side: 'evil',
	},
	undead: {
		attack: 40,
		defence: 10,
		distance: 4,
		range: 1,
		unitLevel: 1,
		side: 'evil',
	},
	daemon: {
		attack: 10,
		defence: 40,
		distance: 1,
		range: 4,
		unitLevel: 2,
		side: 'evil',
	},
};

export default class Character {
	constructor(level, type) {
		this.type = type;
		this.health = 50;
		this._level = 1;
		this.level = level;
		if (new.target.name === 'Character') {
			throw new Error('Creating objects Character using new is illegal!');
		}
	}

	set level(value) { /// подумать
		for (let level = this._level; level !== value; level += 1) {
			this.levelUp();
		}
	}

	get level() {
		return this._level;
	}

	set health(value) {
		this._helath = Math.min(maxHealth, value);
	}

	get health() {
		return this._helath;
	}

	get type() {
		return this._type;
	}

	set type(value) {
		if (charStats[value] === undefined) {
			throw new Error('Invalid type of character!');
		} else {
			({
				attack: this.attack,
				defence: this.defense,
				distance: this.distance,
				range: this.range,
				side: this.side,
				unitLevel: this.unitLevel,
			} = charStats[value]);
			this._type = value;
		}
	}

	levelUp() {
		this._level += 1;
		this.health += 80;
		this.attack = this.statUp(this.attack);
		this.defense = this.statUp(this.defense);
	}

	statUp(stat) {
		return Math.floor(Math.max(stat, (stat * (80 + this.health)) / 100));
	}

	getDamage(attack) {
		const damage = calcDamage(attack, this.defense);
		this.health -= damage;
		return damage;
	}
}