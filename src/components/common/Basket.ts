import { Component } from "../base/Component";
import { EventEmitter } from "../base/events";
import { createElement, ensureElement } from "../../utils/utils";

export interface IBasketView {
    items: HTMLElement[];
    total: number;
    selected: string[];
    disabled: boolean;
}

export interface IBasketItem {
    index: number;
    id: string;
    title: string;
    price: number;
}

export class Basket extends Component<IBasketView> {
    protected _list: HTMLElement;
    protected _price: HTMLElement;
    protected _button: HTMLElement;

    constructor(container: HTMLElement, protected events: EventEmitter) {
        super(container);

        this._list = ensureElement<HTMLElement>('.basket__list', this.container);
        this._price = this.container.querySelector('.basket__price');
        this._button = this.container.querySelector('.basket__button');

        if (this._button) {
            this._button.addEventListener('click', () => {
                events.emit('order:open');
            });
        }

        this.items = [];
    }

    set items(items: HTMLElement[]) {
        if (items.length) {
            this._list.replaceChildren(...items);
        } else {
            this._list.replaceChildren(createElement<HTMLParagraphElement>('p', {
                textContent: 'Корзина пуста'
            }));
        }
    }

    set selected(items: string[]) {
        if (items.length) {
            this.setDisabled(this._button, false);
        } else {
            this.setDisabled(this._button, true);
        }
    }

    set total(total: number) {
        this.setText(this._price, total);
    }
}

export class BasketItem extends Component<IBasketItem> {
    protected _itemIndex: HTMLElement;
    protected _title: HTMLElement;
    protected _price: HTMLElement;
    protected _deleteButton: HTMLElement;
    constructor(container: HTMLElement, protected events: EventEmitter) {
		super(container);
        this._deleteButton = this.container.querySelector('.basket__item-delete');
		if (this._deleteButton) {
			this._deleteButton.addEventListener('click', () => {
				this.events.emit('basket:delete', { index: Number(this._itemIndex.textContent) });
			});
		}
		this._itemIndex = this.container.querySelector('.basket__item-index');
        this._price = this.container.querySelector('.card__price');
        this._title = this.container.querySelector('.card__title');
	}

	set index(value: number) {
		this.setText(this._itemIndex, value);
	}

    set price(value: number) {
		this.setText(this._price, `${value} синапсов`);
	}

	set title(title: string) {
		this.setText(this._title, title);
	}
}