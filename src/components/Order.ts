import {FormUI} from "./common/FormUI";
import {IContactsFormUI, IPaymentFormUI} from "../types";
import {IEvents} from "./base/events";

export class PaymentFormUI extends FormUI<IPaymentFormUI> {
    protected _paymentCardButton: HTMLButtonElement;
    protected _paymentCashButton: HTMLButtonElement;
    protected _addressInput: HTMLInputElement;

    constructor(container: HTMLFormElement, events: IEvents) {
        super(container, events);

        this._paymentCardButton = container.querySelector('button[name="card"]');
        this._paymentCashButton = container.querySelector('button[name="cash"]');
        this._addressInput = container.querySelector('input[name="address"]');

        if (this._paymentCardButton && this._paymentCashButton) {
            this._paymentCardButton.addEventListener('click', () => {
                this.onClick('payment', 'online');
            });

            this._paymentCashButton.addEventListener('click', () => {
                this.onClick('payment', 'offline');
            });
        }
    }

    set address(value: string) {
        this._addressInput.value = value;
    }

    set payment(value: string) {
        if (value === 'online') {
            this.setPaymentMethodActive(this._paymentCardButton, this._paymentCashButton);
        } else if (value === 'offline') {
            this.setPaymentMethodActive(this._paymentCashButton, this._paymentCardButton);
        }
    }

    protected onClick(field: 'payment', value: string) {
        this.events.emit(`${this.container.name}.${String(field)}:change`, {
            field,
            value
        });
        this.payment = value;
    }

    protected setPaymentMethodActive(activeBtn: HTMLButtonElement, inactiveBtn: HTMLButtonElement) {
        this.toggleClass(activeBtn, 'button_alt-active', true);
        this.toggleClass(inactiveBtn, 'button_alt-active', false);
    }
}

export class ContactsFormUI extends FormUI<IContactsFormUI> {
    protected _emailInput: HTMLInputElement;
    protected _phoneInput: HTMLInputElement;

    constructor(container: HTMLFormElement, events: IEvents) {
        super(container, events);

        this._emailInput = container.querySelector('input[name="email"]');
        this._phoneInput = container.querySelector('input[name="phone"]');
    }

    set email(value: string) {
      this._emailInput.value = value;
    }

    set phone(value: string) {
      this._phoneInput.value = value;
    }
}
