import { Model } from './base/Model';
import { IOrder, IProduct, IBasket, PaymentMethod } from '../types';
import { IBasketItem, IBasketView } from './common/Basket';
import { IContacts } from './Contacts';

export interface IOrderForm {
    payment: PaymentMethod;
    address: string;
}

export type formOrderErrors = Partial<Record<keyof IOrderForm, string>>;
export type formContactsErrors = Partial<Record<keyof IContacts, string>>;

export interface IAppState {
    basket: IBasketView[];
	catalog: IProduct[];
	order: IOrder | null;
	loading: boolean;
}

export class ProductItem extends Model<IProduct> {
	id: string;
	title: string;
	image: string;
	category: string;
	description: string;
	price: number;
}

export class AppState extends Model<IAppState> {
	basket: IBasketItem[] = [];
	catalog: ProductItem[];
	loading: boolean;
	formOrderErrors: formOrderErrors = {};
	formContactsErrors: formContactsErrors = {};
	preview: string | null;
	order: IOrder = {
		payment: 'ONLINE',
		address: '',
		email: '',
		total: 0,
		phone: '',
		items: [],
	};

	getTotal() {
		return this.order.items.reduce((ans, item) => ans + this.catalog.find((it) => it.id === item).price, 0);
	}

	setCatalog(products: IBasket) {
		this.catalog = products.items.map((product) => new ProductItem(product, this.events));
		this.emitChanges('items:changed', { catalog: this.catalog });
	}

	addProduct(item: IBasketItem) {
		this.basket.push(item);
	}

	removeProduct(id: number) {
		this.basket = this.basket.filter((item, i) => { return i + 1 !== id; });
		this.events.emit('basket:open');
	}

	clearBasket() {
		this.basket = [];
	}

	updateOrderInfo(field: keyof IOrderForm, value: string & PaymentMethod) {
		this.order[field] = value;
		if (this.isOrderValid()) this.events.emit('order:ready', this.order);
	}

	updateContactInfo(field: keyof IContacts, value: string) {
		this.order[field] = value;
		if (this.areContactsValid()) this.events.emit('contacts:ready', this.order);
	}

	setProductPreview(item: IProduct) {
		this.preview = item.id;
		this.emitChanges('preview:changed', item);
	}

	isInBasket(id: string) {
		return this.basket.find((item) => item.id === id) !== undefined;
	}

	isOrderValid() {
		const errors: typeof this.formOrderErrors = {};
		if (!this.order.address) errors.address = 'Укажите адрес';
		this.formOrderErrors = errors;
		this.events.emit('formOrderErrors:change', this.formOrderErrors);
		return Object.keys(errors).length === 0;
	}

	areContactsValid() {
		const errors: typeof this.formContactsErrors = {};

		if (!this.order.phone) errors.phone = 'Укажите телефон';
		if (!this.order.email) errors.email = 'Укажите почту';

		this.formContactsErrors = errors;
		this.events.emit('formContactsErrors:change', this.formContactsErrors);
		return Object.keys(errors).length === 0;
	}
}