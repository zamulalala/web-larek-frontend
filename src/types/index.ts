export interface IProduct {
  id: string;
  description?: string;
  image?: string;
  title: string;
  category?: string;
  price: string;
}

export interface IAppState {
  catalog: IProduct[];
  basket: string[];
  preview: string | null;
  order: {} | null;
}

export interface ISuccessfulPurchaseUI {
  total: number;
}

export interface IModalUI {
  content: HTMLElement;
}

export interface IBasketUI {
  items: HTMLElement[];
  total: number;
  selected: string[];
}

export interface IPageUI {
  counter: number;
  catalog: HTMLElement[];
}

export interface IProductUI {
  id: string;
  description?: string;
  image?: string;
  title: string;
  category?: string;
  price: string;
}