export type ApiListResponse<Type> = {
    total: number,
    items: Type[]
};

export type ApiPostMethods = 'POST' | 'PUT' | 'DELETE';

export type PaymentMethod = 'ONLINE' | 'OFFLINE';

export type PriceType = number | null;

export interface Product {
    id: string
    title: string
    description: string
    image: string
    category: string
    price: PriceType
}

export interface Api {
    baseUrl: string
    get(url: string): Promise<object>
    post(url: string, data: object, method?: ApiPostMethods): Promise<object>
}

export interface ProductAPI {
    getProductList(): Promise<ApiListResponse<Product>>
    getProduct(id: string): Promise<Product>
    orderProducts(order: Order): Promise<OrderStatus>
}

export interface Basket {
    items: Product[]
    totalPrice: PriceType
    addItem(product: Product): void
    removeItem(id: string): void
    clear(): void
}

export interface Order {
    payment: PaymentMethod
    address: string
    email: string
    phone: string
    items: Product[]
}

export interface OrderStatus {
    id: string
    total: number
    success: boolean
}