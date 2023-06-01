import { EntityRepository, Repository } from 'typeorm';
import Order from '../entities/Order';
import Customer from '../../../customers/typeorm/entities/Customer';

type Product = {
  product_id: string;
  price: number;
  quantity: number;
};

interface IRequest {
  customer: Customer;
  products: Product[];
}

@EntityRepository(Order)
export class OrdersRepository extends Repository<Order> {
  public async createOrder({ customer, products }: IRequest): Promise<Order> {
    const order = this.create({ customer, order_products: products });

    await this.save(order);

    return order;
  }

  public async findById(id: string): Promise<Order | undefined> {
    const order = await this.findOne(id, {
      relations: ['order_products', 'customer'],
    });

    return order;
  }
}
