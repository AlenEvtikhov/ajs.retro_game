export default class GameStateService {
	constructor(storage) {
		this.storage = storage;
	}

	save(state, name) {
		this.storage.setItem(`${name}-save`, JSON.stringify(state));
	}

	set highscore(value) {
		this.storage.setItem('highscore', JSON.stringify(value));
	}

	get highscore() {
		return JSON.parse(this.storage.getItem('highscore'));
	}

	delete(name) {
		this.storage.removeItem(`${name}-save`);
	}

	load(name) {
		try {
			const state = JSON.parse(this.storage.getItem(name));
			if (!state) throw new Error('Invalid state');
			this.loadStatus = true;
			return state;
		} catch (e) {
			this.loadStatus = false;
			throw new Error('Invalid state');
		}
	}

	getSaveList() {
		const saveList = [];
		const len = this.storage.length;
		for (let i = 0; i < len; i += 1) {
			const key = this.storage.key(i);
			if (key.endsWith('-save')) {
				const savename = key.substr(0, key.length - 5);
				saveList.push(savename);
			}
		}
		return saveList;
	}
}