// Подключаем стили
import './scss/styles.scss';

// Импортируем необходимые классы и утилиты
import { EventEmitter } from './components/base/events';
import { WebLarekAPI } from './components/WebLarekAPI';
import { API_URL, CDN_URL } from './utils/constants';
import { cloneTemplate, ensureElement } from './utils/utils';
import { AppState, CatalogChangeEvent } from './components/AppData';
import { PageUI } from './components/PageUI';
import { ModalUI } from './components/common/ModalUI';
import { SuccessfulPurchaseUI } from './components/common/SuccessfulPurchaseUI';
import { BasketItemUI, BasketUI } from './components/common/BasketUI';
import { ContactsFormUI, PaymentFormUI } from './components/Order';
import { ProductUI } from './components/ProductUI';
import { IContactsFormUI, IPaymentFormUI, IProductUI } from './types';

// Создаем экземпляры объектов
const events = new EventEmitter();
const api = new WebLarekAPI(CDN_URL, API_URL);

// Подписываемся на все события для мониторинга
events.onAll(({ eventName, data }) => {
  console.log(eventName, data);
})

// Получаем шаблоны
const successTemplate = ensureElement<HTMLTemplateElement>('#success');
const cardCatalogTemplate = ensureElement<HTMLTemplateElement>('#card-catalog');
const cardPreviewTemplate = ensureElement<HTMLTemplateElement>('#card-preview');
const cardBasketTemplate = ensureElement<HTMLTemplateElement>('#card-basket');
const basketTemplate = ensureElement<HTMLTemplateElement>('#basket');
const orderTemplate = ensureElement<HTMLTemplateElement>('#order');
const contactsTemplate = ensureElement<HTMLTemplateElement>('#contacts');

// Модель состояния приложения
const appData = new AppState({}, events);

// Глобальные контейнеры
const page = new PageUI(document.body, events);
const modal = new ModalUI(ensureElement<HTMLElement>('#modal-container'), events);

// Переиспользуемые компоненты интерфейса
const basket = new BasketUI(cloneTemplate(basketTemplate), events);
const order = new PaymentFormUI(cloneTemplate(orderTemplate), events);
const contacts = new ContactsFormUI(cloneTemplate(contactsTemplate), events);

// Обработка событий и бизнес-логика

// Обновление каталога
events.on<CatalogChangeEvent>('items:changed', () => {
  page.catalog = appData.catalog.map(item => {
      const card = new ProductUI('card', cloneTemplate(cardCatalogTemplate), {
          onClick: () => events.emit('card:select', item)
      });
      return card.render({
          title: item.title,
          image: item.image,
          category: item.category,
			    price: item.price
      });
  });
});

// Открыть товар
events.on('card:select', (item: IProductUI) => {
  appData.setPreview(item);
});

// Просмотр товара
events.on('preview:changed', (item: IProductUI) => {
  const card = new ProductUI('card', cloneTemplate(cardPreviewTemplate), {
    onClick: () => events.emit('card:add', item)
  });

  modal.render({
    content: card.render({
      title: item.title,
      image: item.image,
      description: item.description,
      price: item.price,
      category: item.category
    })
  });
});

// Добавить в корзину
events.on('card:add', (item: IProductUI) => {
  appData.addToOrder(item);
  page.counter = appData.updateCounter();
	modal.close();
});

// Открыть корзину
events.on('basket:open', () => {
  const isBasketEmpty = appData.basket.length === 0;
  basket.setDisabled(basket.button, isBasketEmpty);
  basket.total = appData.getTotal();
  basket.items = appData.basket.map((item, index) => {
    const card = new BasketItemUI(cloneTemplate(cardBasketTemplate), {
      onClick: () => events.emit('card:delete', item)
    });
    return card.render({
      title: item.title,
      price: item.price,
      index: index + 1
    });
  })
  modal.render({
    content: basket.render()
  })
})

// Удалить из корзины
events.on('card:delete', (item: IProductUI) => {
  appData.removeFromOrder(item);
  page.counter = appData.updateCounter();
  const isBasketEmpty = appData.basket.length === 0;
  basket.setDisabled(basket.button, isBasketEmpty);
  basket.total = appData.getTotal();
  basket.items = appData.basket.map((item, index) => {
    const card = new BasketItemUI(cloneTemplate(cardBasketTemplate), {
      onClick: () => events.emit('card:delete', item),
    });
    return card.render({
      title: item.title,
      price: item.price,
      index: index + 1
    });
  })
  modal.render({
    content: basket.render()
  })
})

// Изменение полей формы оплаты
events.on(/^order\..*:change/, (data: { field: keyof IPaymentFormUI, value: string }) => {
	appData.setOrderPaymentForm(data.field, data.value);
});

// Изменение полей формы контактов
events.on(/^contacts\..*:change/, (data: { field: keyof IContactsFormUI, value: string }) => {
	appData.setOrderContactsForm(data.field, data.value);
});

// Изменение состояния валидации формы оплаты
events.on('paymentFormErrors:change', (errors: Partial<IPaymentFormUI>) => {
  const { payment, address } = errors;
  order.valid = !payment && !address;
  order.errors = Object.values({ payment, address }).filter(i => !!i).join('; ');
});

// Изменение состояния валидации формы контактов
events.on('contactsFormErrors:change', (errors: Partial<IContactsFormUI>) => {
  const { email, phone } = errors;
  contacts.valid = !email && !phone;
  contacts.errors = Object.values({ email, phone }).filter(i => !!i).join('; ');
});

// Выбор способа оплаты
events.on('payment:change', (item: HTMLButtonElement) => {
  appData.order.payment = item.name;
})

// Оформление заказа
events.on('basket:order', () => {
  modal.render({
    content: order.render(
      {
        address: '',
        valid: false,
        errors: []
      }
    ),
  });
});

// Подтверждение заказа
events.on('order:submit', () => {
  appData.order.total = appData.getTotal();
  modal.render({
    content: contacts.render({
      email: '',
      phone: '',
      valid: false,
      errors: []
    })
  });
})

// Отправка заказа
events.on('contacts:submit', () => {
  api.orderProducts(appData.order)
    .then((result) => {
      const success = new SuccessfulPurchaseUI(cloneTemplate(successTemplate), {
        onClick: () => {
          modal.close();
          appData.clearBasket();
          page.counter = appData.basket.length;
        }
      });
    
      modal.render({
        content: success.render({
          total: appData.getTotal()
        })
      })
    })
    .catch(err => {
      console.error(err);
    })
});

// Блокировка прокрутки страницы при открытии модального окна
events.on('modal:open', () => {
	page.locked = true;
});

// Разблокировка прокрутки страницы при закрытии модального окна
events.on('modal:close', () => {
	page.locked = false;
});

// Получение списка товаров с сервера
api
	.getProductList()
	.then(appData.setCatalog.bind(appData))
	.catch((err) => {
		console.error(err);
	});