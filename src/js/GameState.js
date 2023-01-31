import {
	changePlayers
} from './utils';
import {
	generateTheme
} from './generators';

export default class GameState {
	constructor(game, driver) {
		this.game = game;
		this.driver = driver;
		this._highscore = this.driver.highscore;
		this.init();
	}

	set highscore(value) {
		this._highscore = value;
		this.driver.highscore = value;
	}

	get highscore() {
		return this._highscore;
	}

	init(name = 'autosave-save') {
		try {
			this.state = this.driver.load(name);
		} catch (e) {
			this.state = {
				history: []
			};
		}
	}

	traceAction(trackedFunction) {
		return async (arg) => {
			if (this.game.action.name && this.game.action.name !== 'activatePosition') {
				this.fixHistory(arg);
				await trackedFunction.call(this.game, arg);
				this.saveTurn();
				this.game.turn += 1;
			} else trackedFunction.call(this.game, arg);
		};
	}

	fixHistory(arg) {
		this.state.currentTurn = this.game.turn;
		this.state.stage = this.game.gameStage;
		this.state.timer = this.game.timer;
		this.state.score = this.game.score;
		this.state.boardSize = this.game.boardSize;
		this.state.teamSize = this.game.team.teamSize;
		this.state.initTotalHealth = this.game.team.initTotalHealth;
		this.state.demo = this.game.demo;
		this.state.initialSide = this.game.initialSide;
		this.state.side = changePlayers[this.game.side];
		while (this.state.history.length > 10) {
			this.state.history.shift();
		}
		this.state.history.push({
			stage: this.game.gameStage,
			turn: this.game.turn,
			timer: this.game.timer,
			side: this.game.side,
			action: this.game.action.name,
			from: this.game.activePosition.position,
			to: arg,
		});
	}

	recoverGame(name) {
		if (name !== 'autosave-save') {
			this.init(name);
		}
		this.game.score = this.state.score;
		this.game.boardSize = this.state.boardSize;
		this.game.teamSize = Math.ceil(this.state.board.length / 2);
		this.game.initialSide = this.state.initialSide;
		this.game.side = this.state.side;
		this.game.generateTheme = generateTheme(this.state.stage - 1);
		this.game.gameStage = this.state.stage;
		this.game.timer = this.state.timer;
		this.objToTeam();
		this.game.demo = this.state.demo;
		this.game.turn = this.state.currentTurn + 1;
	}

	saveTurn(name = 'autosave') {
		this.state.board = [...this.game.team]
			.map((position) => this.teamToObj(position));
		this.driver.save(this.state, name);
	}

	teamToObj(position) {
		const obj = {
			character: {}
		};
		obj.position = position.position;
		for (const property in position.character) {
			if (Object.prototype.hasOwnProperty.call(position.character, property)) {
				obj.character[property] = position.character[property];
			}
		}
		return obj;
	}

	objToTeam() {
		const {
			team
		} = this.game;
		const delta = Math.abs([...team].length - this.state.board.length);
		const pass = Array(delta).fill({
			position: -1,
			character: {
				health: 0
			}
		});
		[...team].forEach((pos, i) => this.fitTeam(pos, [...this.state.board, ...pass][i]));
		team.initTotalHealth = this.state.initTotalHealth;
		team.teamSize = {
			good: this.state.teamSize,
			evil: this.state.teamSize
		};
		this.game.team.teamSize = this.state.teamSize;
		this.game.team.initTotalHealth = this.state.initTotalHealth;
	}

	/* eslint no-param-reassign: "error" */
	fitTeam(position, object) {
		position.position = object.position;
		for (const property in position.character) {
			if (Object.prototype.hasOwnProperty.call(position.character, property)) {
				position.character[property] = object.character[property];
			}
		}
	}
}