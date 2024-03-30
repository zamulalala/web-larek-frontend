import { IOrder, IOrderResult, IProduct } from '../types';
import { Api, ApiListResponse } from './base/api';

interface IWebLarekAPI {
    getProductItem(id: string): Promise<IProduct>;
    getProductList: () => Promise<IProduct[]>;
    orderProducts(order: IOrder): Promise<IOrderResult>;
}

class WebLarekAPI extends Api implements IWebLarekAPI {
    readonly cdn: string;

    constructor(cdn: string, baseUrl: string, options?: RequestInit) {
        super(baseUrl, options);
        this.cdn = cdn;
    }

    getProductItem(id: string): Promise<IProduct> {
      return this.get(`/product/${id}`).then(
          (item: IProduct) => ({
              ...item,
              image: this.cdn + item.image,
          })
      );
    }

    getProductList(): Promise<IProduct[]> {
      return this.get('/product').then((data: ApiListResponse<IProduct>) =>
          data.items.map((item) => ({
              ...item,
              image: this.cdn + item.image
          }))
      );
    }

    orderProducts(order: IOrder): Promise<IOrderResult> {
        return this.post('/order', order).then(
            (data: IOrderResult) => data
        );
    }
}

export { WebLarekAPI };
