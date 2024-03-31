import _ from "lodash";

import {Model} from "./base/Model";
import {FormErrors, IAppState, IContactsFormUI, IOrder, IPaymentFormUI, IProduct, IProductUI} from "../types";

export type CatalogChangeEvent = {
    catalog: IProductUI[];
};

export class AppState extends Model<IAppState> {
    catalog: IProductUI[];
    basket: IProduct[] = [];
    preview: string;
    order: IOrder = {
        payment: '',
        address: '',
        email: '',
        phone: '',
        items: [],
        total: 0,
    };
    formErrors: FormErrors = {};

    toggleOrderedProduct(id: string, isIncluded: boolean) {
		if (isIncluded) {
			this.order.items = _.uniq([...this.order.items, id]);
		} else {
			this.order.items = _.without(this.order.items, id);
		}
	}

	clearBasket() {
		this.basket = []
        this.order.items = []
	}

    getTotal() {
        return this.order.items.reduce((a, c) => a + this.catalog.find(it => it.id === c).price, 0);
    }

    setCatalog(items: IProductUI[]) {
        this.catalog = items;
        this.emitChanges('items:changed', { catalog: this.catalog });
    }

    setPreview(item: IProductUI) {
        this.preview = item.id;
        this.emitChanges('preview:changed', item);
    }

    setOrderPaymentForm(field: keyof IPaymentFormUI, value: string) {
        this.order[field] = value;

        if (this.validatePaymentForm()) {
            this.emitChanges('order:ready', this.order);
        }
    }

    setOrderContactsForm(field: keyof IContactsFormUI, value: string) {
        this.order[field] = value;

        if (this.validateContactsForm()) {
            this.emitChanges('order:ready', this.order);
        }
    }

    validatePaymentForm() {
        const errors: typeof this.formErrors = {};
        if (!this.order.payment) {
			errors.payment = 'Необходимо выбрать способ оплаты';
		}
        if (!this.order.address) {
            errors.address = 'Необходимо указать адрес доставки';
        }
        this.formErrors = errors;
        this.emitChanges('paymentFormErrors:change', this.formErrors);
        return Object.keys(errors).length === 0;
    }

    validateContactsForm() {
        const errors: typeof this.formErrors = {};
        if (!this.order.email) {
            errors.email = 'Необходимо указать email';
          }
          if (!this.order.phone) {
            errors.phone = 'Необходимо указать телефон';
          }
        this.formErrors = errors;
        this.emitChanges('contactsFormErrors:change', this.formErrors);
        return Object.keys(errors).length === 0;
    }

    addToOrder(item: IProductUI) {
        if (!this.basket.includes(item)) {
            this.basket.push(item);
        }
        if (!this.order.items.includes(item.id)) {
            this.order.items.push(item.id);
        }
    }
    
    removeFromOrder(item: IProduct) {
        const basketIndex = this.basket.findIndex((basketItem) => basketItem.id === item.id);
        const orderIndex = this.order.items.indexOf(item.id);
        
        if (basketIndex !== -1) {
            this.basket.splice(basketIndex, 1);
        }
    
        if (orderIndex !== -1) {
            this.order.items.splice(orderIndex, 1);
        }
    }

    updateCounter(): number {
        return this.basket.length;
    }
}

