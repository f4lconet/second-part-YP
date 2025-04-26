# Проектная работа "Веб-ларек"

Стек: HTML, SCSS, TS, Webpack

Структура проекта:
- src/ — исходные файлы проекта
- src/components/ — папка с JS компонентами
- src/components/base/ — папка с базовым кодом

Важные файлы:
- src/pages/index.html — HTML-файл главной страницы
- src/types/index.ts — файл с типами
- src/index.ts — точка входа приложения
- src/scss/styles.scss — корневой файл стилей
- src/utils/constants.ts — файл с константами
- src/utils/utils.ts — файл с утилитами

## Установка и запуск
Для установки и запуска проекта необходимо выполнить команды

```
npm install
npm run start
```

или

```
yarn
yarn start
```
## Сборка

```
npm run build
```

или

```
yarn build
```

## UML-диаграмма
![print1_architect](https://github.com/user-attachments/assets/bbfb358a-77e5-42dd-9bfa-48df0ac1d9a2)

Проект построен по принципу **MVP (Model-View-Presenter)**

На UML-диаграмме можно наглядно увидеть, как части приложения взаимодействуют между собой

## Модели данных:
- `Product` - модель данных товара
- `Order` - модель данных заказа
- `Basket` - модель корзины
- `ApiService` - слой работы с API

**Функции:**
- Хранение состояния приложения
- Бизнес-логика
- Работа с данными

## Типы данных и интерфейсы

### Базовые типы
```typescript
// Ответ API для списков
type ApiListResponse<T> = {
  total: number    // Общее количество элементов
  items: T[]       // Массив элементов
}

// Типы запросов
type ApiPostMethods = 'POST' | 'PUT' | 'DELETE'

// Варианты оплаты
type PaymentMethod = 'ONLINE' | 'OFFLINE'

// Тип цены
type PriceType = number | null
```

### Основные интерфейсы
#### Модель товара - модель данных товара
```typescript
interface Product {
  id: string           // Уникальный идентификатор
  title: string        // Наименование
  description: string  // Описание
  image: string        // URL изображения
  category: string     // Категория
  price: PriceType     // Цена
}
```

#### Модель заказа - модель данных заказа
```typescript
interface Order {
  payment: PaymentMethod  // Способ оплаты
  address: string        // Адрес доставки
  email: string          // Email покупателя
  phone: string          // Телефон
  items: Product[]       // Состав заказа
}
```

#### API сервис - слой работы с API
```typescript
interface ApiService {
  baseUrl: string
  
  // Получить данные
  get(url: string): Promise<object>
  
  // Отправить данные
  post(url: string, data: object, method?: ApiPostMethods): Promise<object>
}
```

#### Корзина - модель корзины
```typescript
interface Basket {
  items: Product[]      // Товары в корзине
  totalPrice: PriceType // Итоговая сумма
  
  // Добавить товар
  addItem(product: Product): void
  
  // Удалить товар
  removeItem(id: string): void
  
  // Очистить корзину
  clear(): void
}
```
