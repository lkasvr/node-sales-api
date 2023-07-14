import { v4 as uuidv4 } from 'uuid';
import Order from '@modules/orders/infra/typeorm/entities/Order';
import OrdersProducts from '@modules/orders/infra/typeorm/entities/OrdersProducts';
import { IOrder } from '../../models/IOrder';
import { IOrdersRepository } from '@modules/orders/domain/repositories/IOrdersRepository';
import { ICreateOrder } from '@modules/orders/domain/models/ICreateOrder';

class FakeOrdersRepository implements IOrdersRepository {
  private orders: IOrder[] = [];

  public async create({ customer, products }: ICreateOrder): Promise<Order> {
    const order = new Order();
    const ordersProducts = new OrdersProducts();

    ordersProducts.id = uuidv4();

    order.id = uuidv4();
    order.customer = customer;
    order.order_products = products.map(({ product_id, price, quantity }) => {
      return {
        id: uuidv4(),
        order,
        product: ordersProducts.product,
        product_id,
        order_id: ordersProducts.id,
        price,
        quantity,
        created_at: ordersProducts.created_at,
        updated_at: ordersProducts.updated_at,
      }
    });

    this.orders.push(order);

    return order;
  }

  public async findById(id: string): Promise<IOrder | undefined> {
    const order = this.orders.find(order => order.id === id);
    return order;
  }
}

export default FakeOrdersRepository;
