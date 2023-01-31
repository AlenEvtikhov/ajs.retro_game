import Form from './Form';

export default class NewGameForm extends Form {
	fillForm() {
		this.totalScoreElement = this.modal.querySelector('.total-score');
		this.totalScoreElement.innerText = this.game.score;
	}

	dismis(event) {
		this.game.gamePlay.onDemoGameClick(event);
	}

	onSubmit(event) {
		this.eventHandler(event);
		this.game.gamePlay.showModal('newGame');
	}
}