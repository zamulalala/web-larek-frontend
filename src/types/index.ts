// Интерфейс, описывающий структуру продукта
export interface IProduct {
  id: string;
  description?: string;
  image?: string;
  title: string;
  category?: string;
  price: string;
}

// Интерфейс, описывающий глобальное состояние приложения
export interface IAppState {
  catalog: IProduct[];
  basket: string[];
  preview: string | null;
  order: IOrder | null;
}

// Интерфейс для UI формы оплаты
export interface IPaymentFormUI {
  payment: string;
  address: string;
}

// Интерфейс для UI формы контактов
export interface IContactsFormUI {
  email: string;
  tel: string;
}

// Интерфейс для данных о заказе
export interface IOrder extends IPaymentFormUI, IContactsFormUI {
  items: string[]
}

// Интерфейс для UI успешной покупки
export interface ISuccessfulPurchaseUI {
  total: number;
}

// Интерфейс для UI модального окна
export interface IModalUI {
  content: HTMLElement;
}

// Интерфейс для UI корзины покупок
export interface IBasketUI {
  items: HTMLElement[];
  total: number;
  selected: string[];
}

// Интерфейс для UI главной страницы
export interface IPageUI {
  counter: number;
  catalog: HTMLElement[];
}

// Интерфейс для UI отображения продукта
export interface IProductUI {
  id: string;
  description?: string;
  image?: string;
  title: string;
  category?: string;
  price: string;
}