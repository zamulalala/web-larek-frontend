import {Component} from "./base/Component";
import {IProductUI} from "../types";
import {ensureElement} from "../utils/utils";
import { CATEGORY_CLASS_MAP } from "../utils/constants";

interface IProductUIActions {
    onClick: (event: MouseEvent) => void;
}

export class ProductUI extends Component<IProductUI> {
    protected _title: HTMLElement;
    protected _image?: HTMLImageElement;
    protected _description?: HTMLElement;
    protected _category?: HTMLElement
    protected _price?: HTMLElement
    button?: HTMLButtonElement;
    

    constructor(protected blockName: string, container: HTMLElement, actions?: IProductUIActions) {
        super(container);

        this._title = ensureElement<HTMLElement>(`.${blockName}__title`, container);
        this._image = ensureElement<HTMLImageElement>(`.${blockName}__image`, container);
        this.button = container.querySelector(`.${blockName}__button`);
        this._description = container.querySelector(`.${blockName}__text`);
        this._category = container.querySelector(`.${blockName}__category`);
        this._price = container.querySelector(`.${blockName}__price`);


        if (actions?.onClick) {
            if (this.button) {
                this.button.addEventListener('click', actions.onClick);
            } else {
                container.addEventListener('click', actions.onClick);
            }
        }
    }

    set id(value: string) {
        this.container.dataset.id = value;
    }

    get id(): string {
        return this.container.dataset.id || '';
    }

    set title(value: string) {
        this.setText(this._title, value);
    }

    get title(): string {
        return this._title.textContent || '';
    }

    set image(value: string) {
        this.setImage(this._image, value, this.title)
    }

    set description(value: string | string[]) {
        if (Array.isArray(value)) {
            this._description.replaceWith(...value.map(str => {
                const descTemplate = this._description.cloneNode() as HTMLElement;
                this.setText(descTemplate, str);
                return descTemplate;
            }));
        } else {
            this.setText(this._description, value);
        }
    }

    set category(value: string) {
        const categoryClass = CATEGORY_CLASS_MAP[value];
        if (categoryClass) {
            this._category.classList.add(categoryClass);
        }
        this.setText(this._category, value);
    }

    get category(): string {
		return this._category.textContent || '';
	}

    set price(value: string | null) {
        const text = value === null ? 'Бесценно' : `${value} синапсов`;
        this.setText(this._price, text);
	}

    get price(): string {
		return this._price.textContent || '';
	}
}