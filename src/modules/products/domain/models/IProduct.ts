import { IOrderProduct } from '@modules/orders/domain/models/IOrderProduct';

export interface IProduct {
  id: string;
  order_products: IOrderProduct[];
  name: string;
  price: number;
  quantity: number;
  created_at: Date;
  updated_at: Date;
}
