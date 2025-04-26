export type ApiListResponse<Type> = {
    total: number;
    items: Type[];
};

export type ApiPostMethods = 'POST' | 'PUT' | 'DELETE';

export type PaymentMethod = 'ONLINE' | 'OFFLINE';

export type PriceType = number | null;

export interface IProduct {
    id: string;
    title: string;
    description: string;
    image: string;
    category: string;
    price: PriceType;
}

export interface IApi {
    baseUrl: string;
    get<T>(url: string): Promise<T>;
    post<T>(url: string, data: object, method?: ApiPostMethods): Promise<T>;
}

export interface IProductAPI {
    getProductList(): Promise<IBasket>;
    getProduct(id: string): Promise<IProduct>;
    orderProducts(order: IOrder): Promise<IOrderStatus>;
}

export interface IBasket {
    items: IProduct[];
    totalPrice: PriceType;
}

export interface IOrder {
    total: number;
    payment: PaymentMethod;
    address: string;
    email: string;
    phone: string;
    items: string[];
}

export interface IOrderStatus {
    id: string;
    total: number;
    success: boolean;
}