import { Page } from './components/Page';
import './scss/styles.scss';
import { AppState, ProductItem } from './components/AppData';
import { EventEmitter } from './components/base/events';
import { Basket } from './components/common/Basket';
import { BasketItem, IBasketItem } from './components/common/Basket';
import { IProduct, IBasket, PaymentMethod } from './types';
import { Card } from './components/Card';
import { Modal } from './components/common/Modal';
import { Success } from './components/common/Success';
import { IContacts, Contacts } from './components/Contacts';
import { ProductApi } from './components/Api';
import { Order } from './components/Order';
import { IOrderForm } from './components/AppData';
import { API_URL, CDN_URL } from './utils/constants';
import { cloneTemplate, createElement, ensureElement } from './utils/utils';

const events = new EventEmitter();
const api = new ProductApi(CDN_URL, API_URL);
const successTemplate = ensureElement<HTMLTemplateElement>('#success');
const basketTemplate = ensureElement<HTMLTemplateElement>('#basket');
const orderTemplate = ensureElement<HTMLTemplateElement>('#order');
const contactsTemplate = ensureElement<HTMLTemplateElement>('#contacts');
const cardCatalogTemplate = ensureElement<HTMLTemplateElement>('#card-catalog');
const cardPreviewTemplate = ensureElement<HTMLTemplateElement>('#card-preview');
const cardBasketTemplate = ensureElement<HTMLTemplateElement>('#card-basket');
const appData = new AppState({}, events);
const page = new Page(document.body, events);
const contacts = new Contacts(cloneTemplate(contactsTemplate), events);
const modal = new Modal(ensureElement<HTMLElement>('#modal-container'), events);
const basket = new Basket(cloneTemplate(basketTemplate), events);
const order = new Order(cloneTemplate(orderTemplate), events);

events.onAll(({ eventName, data }) => {
	console.log(eventName, data);
});

events.on('contacts:submit', () => {
	api
		.orderProducts(appData.order)
		.then((result) => {
			const success = new Success(cloneTemplate(successTemplate), {
				onClick: () => {
					modal.close();
				},
			});
			success.setTotalPrice(result.total);
			modal.render({
				content: success.render({}),
			});

			appData.clearBasket();
			page.counter = 0;
		})
		.catch((err) => {
			console.error(err);
		});
});

events.on('formOrderErrors:change', (errors: Partial<IOrderForm>) => {
	const { address } = errors;
	order.valid = !address;
	order.errors = Object.values({ address })
		.filter((i) => !!i)
		.join('; ');
});

events.on('modal:open', () => {
	page.locked = true;
});

events.on('modal:close', () => {
	page.locked = false;
});

events.on('items:changed', () => {
	page.gallery = appData.catalog.map((item: IProduct) => {
		const card = new Card('card', cloneTemplate(cardCatalogTemplate), {
			onClick: () => events.emit('card:select', item),
		});
		return card.render({
			title: item.title,
			image: api.cdn + item.image,
			description: item.description,
			category: item.category,
			price: item.price,
		});
	});

	page.counter = appData.basket.length;
});

events.on('order:submit', () => {
	modal.render({
		content: contacts.render({
			phone: '',
			email: '',
			valid: false,
			errors: [],
		}),
	});
});

events.on('formContactsErrors:change', (errors: Partial<IContacts>) => {
	const { email, phone } = errors;
	contacts.valid = !email && !phone;
	contacts.errors = Object.values({ email, phone })
		.filter((i) => !!i)
		.join('; ');
});

events.on(/^order\..*:change/, (data: { field: keyof IOrderForm; value: string & PaymentMethod }) => {
	appData.updateOrderInfo(data.field, data.value);
});

events.on(/^contacts\..*:change/, (data: { field: keyof IContacts; value: string }) => {
	appData.updateContactInfo(data.field, data.value);
});

events.on('order:open', () => {
	appData.order.items = appData.basket.map((item) => item.id);
	appData.order.total = appData.basket.reduce((sum, item) => item.price + sum, 0);

	console.log(appData.order);

	modal.render({
		content: order.render({
			payment: 'ONLINE',
			address: '',
			valid: false,
			errors: [],
		}),
	});
});

events.on('card:select', (item: ProductItem) => {
	appData.setProductPreview(item);
});

events.on('basket:delete', (item: IBasketItem) => {
	appData.removeProduct(item.index);
	page.counter = appData.basket.length;
});

events.on('preview:changed', (item: ProductItem) => {
	const showItem = (item: ProductItem) => {
		const product = new Card('card', cloneTemplate(cardPreviewTemplate), {
			onClick: () => events.emit('basket:push', item),
		});

		modal.render({
			content: product.render({
				title: item.title,
				image: api.cdn + item.image,
				category: item.category,
				description: item.description,
				price: item.price,
				disabled: !item.price || appData.isInBasket(item.id) ? true : false,
			}),
		});
	};

	if (item) {
		api
			.getProduct(item.id)
			.then((result) => {
				item.description = result.description;
				showItem(item);
			})
			.catch((err) => {
				console.error(err);
			});
	} else {
		modal.close();
	}
});

events.on('basket:push', (item: ProductItem) => {
	appData.addProduct({
		id: item.id,
		index: appData.basket.length,
		title: item.title,
		price: item.price,
	});
	page.counter = appData.basket.length;
	modal.close();
});

events.on('basket:open', () => {
	modal.render({
		content: createElement<HTMLElement>('div', {}, [
			basket.render({
				items: appData.basket.reduce((array, item: IBasketItem, i) => {
					const cardBasket = new BasketItem(cloneTemplate(cardBasketTemplate), events);
					return [
						...array,
						cardBasket.render({
							index: i + 1,
							title: item.title,
							price: item.price,
						}),
					];
				}, []),
				total: appData.basket.reduce((total, item) => total + item.price, 0),
				disabled: appData.basket.length ? false : true,
			}),
		]),
	});
});

api.getProductList().then((products: IBasket) => {
		appData.setCatalog(products);
	})
	.catch((err) => {
		console.error(err);
	});