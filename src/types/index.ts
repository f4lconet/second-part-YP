type ApiListResponse<Type> = {
    total: number,
    items: Type[]
};

type ApiPostMethods = 'POST' | 'PUT' | 'DELETE';

type PaymentMethod = 'ONLINE' | 'OFFLINE';

type PriceType = number | null;

interface Product {
    id: string
    title: string
    description: string
    image: string
    category: string
    price: PriceType
}

interface Api {
    baseUrl: string
    get(url: string): Promise<object>
    post(url: string, data: object, method?: ApiPostMethods): Promise<object>
}

interface ProductAPI {
    getProductList(): Promise<ApiListResponse<Product>>
    getProduct(id: string): Promise<Product>
    orderProducts(order: Order): Promise<OrderStatus>
}

interface Basket {
    items: Product[]
    totalPrice: PriceType
    addItem(product: Product): void
    removeItem(id: string): void
    clear(): void
}

interface Order {
    payment: PaymentMethod
    address: string
    email: string
    phone: string
    items: Product[]
}

interface OrderStatus {
    id: string
    total: number
    success: boolean
}