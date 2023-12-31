// App
import { inject, injectable } from 'tsyringe';
import AppError from '@shared/errors/AppError';
import { IOrder } from '../domain/models/IOrder';
import { IRequestCreateOrder } from '../domain/models/IRequestCreateOrder';

import { IOrdersRepository } from '@modules/orders/domain/repositories/IOrdersRepository';
import { ICustomersRepository } from '@modules/customers/domain/repositories/ICustomersRepository';
import { IProductsRepository } from '@modules/products/domain/repositories/IProductsRepository';

@injectable()
class CreateOrderService {
  constructor(
    @inject('OrdersRepository')
    private ordersRepository: IOrdersRepository,
    @inject('CustomersRepository')
    private customersRepository: ICustomersRepository,
    @inject('ProductsRepository')
    private productsRepository: IProductsRepository,
  ) { }

  public async execute({
    customer_id,
    products,
  }: IRequestCreateOrder): Promise<IOrder> {
    const customerExists = await this.customersRepository.findById(customer_id);

    if (!customerExists)
      throw new AppError(`Couldn't find any customer with the given id`);

    const existsProducts = await this.productsRepository.findAllByIds(products);

    if (!existsProducts.length)
      throw new AppError(`Couldn't find any products with the given ids`);

    const existsProductsIds = existsProducts.map(product => product.id);

    const checkNoneExistentProducts = products.filter(
      product => !existsProductsIds.includes(product.id),
    );

    if (checkNoneExistentProducts.length)
      throw new AppError(
        `Couldn't find product ${checkNoneExistentProducts[0].id}`,
      );

    const quantityAvailable = products.filter(
      product => {
        const quantity = existsProducts.filter(p => p.id === product.id)[0].quantity;

        return (quantity < product.quantity || quantity === 0);
      }
    );
    if (quantityAvailable.length)
      throw new AppError(
        `The quantity ${quantityAvailable[0].quantity} is not available for ${quantityAvailable[0].id}.`,
      );

    const serializedProducts = products.map(product => ({
      product_id: product.id,
      quantity: product.quantity,
      price: existsProducts.filter(p => p.id === product.id)[0].price,
    }));

    const order = await this.ordersRepository.create({
      customer: customerExists,
      products: serializedProducts,
    });

    const { order_products } = order;

    const updatedProductQuantity = order_products.map(product => ({
      id: product.product_id,
      quantity:
        existsProducts.filter(p => p.id === product.product_id)[0].quantity -
        product.quantity,
    }));

    await this.productsRepository.updateStock(updatedProductQuantity);

    return order;
  }
}

export default CreateOrderService;
