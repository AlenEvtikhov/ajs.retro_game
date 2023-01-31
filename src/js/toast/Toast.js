export default class Toast {
	constructor(container) {
		this.container = container;
	}

	showMessage(message) {
		this.addElement('div', 'toast message', message);
	}

	showError(message) {
		this.addElement('div', 'toast error', message);
	}

	addElement(tag, cssClass, text) {
		const cssList = cssClass.split(' ');
		const positionTop = [...this.container.querySelectorAll(`.${cssList[0]}`)].length + 1;
		const element = document.createElement(tag);
		element.innerText = text;
		element.classList.add(...cssList);
		element.style.top = `${12 * positionTop}%`;
		element.addEventListener('animationend', () => {
			if (this.container.contains(element)) {
				this.container.removeChild(element);
				this.redrawToastList();
			}
		});
		this.container.appendChild(element);
	}

	redrawToastList() {
		const toastList = [...this.container.querySelectorAll('.toast')];
		toastList.forEach((element, position) => {
			this.moveToast(element, 12 * (position + 1));
		});
	}

	moveToast(toast, position) {
		const intervalId = setInterval(() => {
			const currentPosition = +toast.style.top.substr(0, 2);
			if (currentPosition > position) {
				toast.style.top = `${currentPosition - 1}%`;
			} else {
				clearInterval(intervalId);
			}
		}, 10);
	}
}