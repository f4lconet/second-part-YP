import { Api } from './base/api';
import { IOrderStatus, IOrder, IBasket, IProduct, IProductAPI } from '../types';

export class ProductApi extends Api implements IProductAPI {
	readonly cdn: string;

	constructor(cdn: string, baseUrl: string, options?: RequestInit) {
		super(baseUrl, options);
		this.cdn = cdn;
	}

	getProduct(id: string): Promise<IProduct> {
		return this.get(`/product/${id}`).then((product: IProduct) => product);
	}

	getProductList(): Promise<IBasket> {
		return this.get(`/product`).then((products: IBasket) => ({
			...products,
		}));
	}

	orderProducts(order: IOrder): Promise<IOrderStatus> {
		return this.post(`/order`, order).then((res: IOrderStatus) => res);
	}
}