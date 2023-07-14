import { ICreateOrderProduct } from '@modules/orders/domain/models/ICreateOrderProduct';

export interface IRequestCreateOrder {
  customer_id: string;
  products: ICreateOrderProduct[];
}
