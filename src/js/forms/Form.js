import formSelector from './templateForms';

export default class Form {
	constructor(template, modal) {
		this.template = formSelector(template);
		this.modal = modal;
	}

	show(game) {
		this.game = game;
		this.game.gamePause();
		this.modal.style.display = 'block';
		this.modal.innerHTML = this.template;
		this.form = this.modal.querySelector('#game-params-form');
		this.fillForm();
		this.registerEvents();
	}

	close() {
		this.modal.style.display = 'none';
		this.unregisterEvents();
		this.game.gameRun();
	}

	registerEvents() {
		this.dismiss = this.modal.querySelector('button[data-dismiss="modal"]');
		this.dismiss.onclick = this.dismis.bind(this);
		this.form.onsubmit = this.onSubmit.bind(this);
	}

	unregisterEvents() {
		this.dismiss.onclick = '';
		this.form.onsubmit = '';
	}

// 	fillForm() {
// }

// 	onSubmit() {

// 	}

	dismis() {
		this.close();
	}

	eventHandler(event) {
		event.preventDefault();
		return new FormData(this.form);
	}

	addElement(parent, tag, cssClass, text) {
		const element = document.createElement(tag);
		element.innerText = text;
		element.classList.add(...cssClass.split(' '));
		parent.appendChild(element);
		return element;
	}
}