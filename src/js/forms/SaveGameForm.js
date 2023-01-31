import Form from './Form';

export default class SaveGameForm extends Form {
	fillForm() {
		this.saveContainer = this.modal.querySelector('.save-container');
		this.saveContainer.innerHTML = '';
		const saveList = this.game.stateService.getSaveList();
		for (const save of saveList) {
			const element = this.addElement(this.saveContainer, 'li', 'save-list-item', '');
			const inner = this.addElement(element, 'div', `save ${save}`, '');
			this.addElement(inner, 'div', 'save-name', save);
			const delElement = this.addElement(inner, 'div', 'delete', 'X');
			delElement.addEventListener('click', (event) => {
				const keyName = event.target.parentNode.classList[1];
				this.game.stateService.delete(keyName);
				this.fillForm();
			});
		}
	}

	onSubmit(event) {
		const data = this.eventHandler(event);
		const name = data.get('save-input');
		this.game.saveGame(name);
		this.close();
	}
}