import { Component } from "./base/Component";
import { ensureElement } from "../utils/utils";
import { IProduct } from "../types";

export interface ICard extends IProduct {
    disabled: boolean;
}

export interface ICardEvents {
    onClick: (event: MouseEvent) => void;
}

export class Card extends Component<ICard> {
	protected _title: HTMLElement;
	protected _image?: HTMLImageElement;
	protected _description?: HTMLElement;
	protected _button?: HTMLButtonElement;
	protected _category?: HTMLElement;
	protected _price?: HTMLElement;

	constructor(protected blockName: string, container: HTMLElement, actions?: ICardEvents) {
		super(container);

		this._title = ensureElement<HTMLElement>(`.${blockName}__title`, container);
		this._image = ensureElement<HTMLImageElement>(`.${blockName}__image`, container);
		this._description = container.querySelector(`.${blockName}__description`);
		this._button = container.querySelector(`.${blockName}__button`);
		this._category = container.querySelector(`.${blockName}__category`);
		this._price = container.querySelector(`.${blockName}__price`);

		if (actions?.onClick) {
			if (this._button) {
				this._button.addEventListener('click', actions.onClick);
			} else {
				container.addEventListener('click', actions.onClick);
			}
		}
	}

	get id(): string {
		return this.container.dataset.id || '';
	}

	set id(value: string) {
		this.container.dataset.id = value;
	}

	get title(): string {
		return this._title.textContent || '';
	}

	set title(value: string) {
		this.setText(this._title, value);
	}

	set image(value: string) {
		this.setImage(this._image, value, this.title);
	}

	set description(value: string | string[]) {
		if (Array.isArray(value)) {
			this._description.replaceWith(
				...value.map((str) => {
					const template = this._description.cloneNode() as HTMLElement;
					this.setText(template, str);
					return template;
				})
			);
		} else {
			this.setText(this._description, value);
		}
	}

	set disabled(flag: boolean) {
		this._button.disabled = flag;
	}

	set category(value: string) {
		this.setText(this._category, value);
		const categoryMap: { [key: string]: string } = {
			'кнопка': 'button',
			'софт-скил': 'soft',
			'дополнительное': 'additional',
			'хард-скил': 'hard',
			'другое': 'other'
		};
		const category = categoryMap[value] || '';
		this._category.classList.add(`card__category_${category}`);
	}

	set price(value: number | null) {
		if (value) {
			this.setText(this._price, `${value} синапсов`);
		} else {
			this.setText(this._price, `Бесценно`);
		}
	}
}