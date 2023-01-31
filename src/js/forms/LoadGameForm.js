import Form from './Form';

export default class LoadGameForm extends Form {
	fillForm() {
		this.loadContainer = this.modal.querySelector('.load-container');
		const saveList = this.game.stateService.getSaveList();
		for (const save of saveList) {
			this.addElement(this.loadContainer, 'option', 'load-list-item', save);
		}
	}

	onSubmit(event) {
		const data = this.eventHandler(event);
		const name = data.get('load-input');
		this.game.loadGame(`${name}-save`);
	}
}