import {Component} from "./base/Component";
import {ensureElement} from "../utils/utils";

interface ISuccessfulPurchaseUI {
    total: number;
}

interface ISuccessfulPurchaseUIActions {
    onClick: () => void;
}

export class SuccessfulPurchaseUI extends Component<ISuccessfulPurchaseUI> {
    protected _close: HTMLButtonElement;
    protected _total: HTMLElement;

    constructor(container: HTMLElement, actions: ISuccessfulPurchaseUIActions) {
        super(container);

        this._close = ensureElement<HTMLButtonElement>('.order-success__close', this.container);
        this._total = ensureElement<HTMLElement>('.order-success__description', this.container)

        if (actions?.onClick) {
            this._close.addEventListener('click', actions.onClick);
        }
    }

    set total(totalSynapses: number) {
        this.setText(this._total, `Списано ${totalSynapses} синапсов`);
    }

}