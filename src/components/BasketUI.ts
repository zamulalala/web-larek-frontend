import {Component} from "./base/Component";
import {createElement, ensureElement, formatNumber} from "../utils/utils";
import {EventEmitter} from "./base/Events";
import { IProductBasket } from "../types";

interface IBasketUI {
    items: HTMLElement[];
    total: number;
    selected: string[];
}

export class BasketUI extends Component<IBasketUI> {
    protected _list: HTMLElement;
    protected _total: HTMLElement;
    button: HTMLElement;

    constructor(container: HTMLElement, protected events: EventEmitter) {
        super(container);

        this._list = ensureElement<HTMLElement>('.basket__list', this.container);
        this._total = this.container.querySelector('.basket__price');
        this.button = this.container.querySelector('.basket__button');

        if (this.button) {
            this.button.addEventListener('click', () => {
                events.emit('basket:order');
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

    set total(total: number) {
        this.setText(this._total, `${formatNumber(total)} синапсов`);
    }
}

export interface IBasketItemUIActions {
    onClick: (event: MouseEvent) => void;
  }
  
  export class BasketItemUI extends Component<IProductBasket> {
    protected _deleteButton?: HTMLButtonElement;
    protected _index?: HTMLElement;
    protected _title: HTMLElement;
    protected _price: HTMLElement;

    constructor(container: HTMLElement, actions?: IBasketItemUIActions) {
        super(container);


        this._deleteButton = container.querySelector(`.card__button`);
        this._index = ensureElement<HTMLElement>('.basket__item-index', container);
        this._title = ensureElement<HTMLElement>(`.card__title`, container);
        this._price = ensureElement<HTMLElement>(`.card__price`, container);
        
        if (actions?.onClick) {
            if (this._deleteButton) {
                this._deleteButton.addEventListener('click', actions.onClick);
            } 
          }
        }
      
        set index(value: number) {
          this.setText(this._index, value);
        }
      
        set title(value: string) {
          this.setText(this._title, value);
        }
      
        set price(value: string) {
          if(value === null) {
            this.setText(this._price, `Бесценно`);
          } else {
            this.setText(this._price, `${value} синапсов`);
          }
        }
      }
      