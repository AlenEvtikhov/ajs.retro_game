import Form from './Form';

export default class NewGameForm extends Form {
	fillForm() {
		this.boardSizeControl = this.modal.querySelector('#board-size-control');
		this.teamSizeControl = this.modal.querySelector('#team-size-control');
		this.boardSizeIndicator = this.modal.querySelector('.board-size');
		this.teamSizeIndicator = this.modal.querySelector('.team-size');
		this.boardSizeControl.onchange = this.showBoardSize.bind(this);
		this.teamSizeControl.onchange = this.showTeamSize.bind(this);
	}

	showBoardSize(event) {
		const {
			value
		} = event.target;
		this.boardSizeIndicator.innerText = value;
		this.teamSizeControl.max = 2 * value;
		this.teamSizeIndicator.innerText = this.teamSizeControl.value;
	}

	showTeamSize(event) {
		const {
			value
		} = event.target;
		this.teamSizeIndicator.innerText = value;
	}

	onSubmit(event) {
		const data = this.eventHandler(event);
		const selectSide = data.get('side');
		const selectBoardSize = +data.get('boardSize');
		const selectTeamSize = +data.get('teamSize');
		this.game.newGame(selectBoardSize, selectTeamSize, selectSide, false);
	}
}