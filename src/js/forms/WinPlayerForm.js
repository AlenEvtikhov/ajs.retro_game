import Form from './Form';

export default class WinPlayerForm extends Form {
	fillForm() {
		this.totalScoreElement = this.modal.querySelector('.total-score');
		this.totalScoreElement.innerText = this.game.score;
	}

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	dismis(_event) {
		this.game.gameNext();
		this.close();
	}
}