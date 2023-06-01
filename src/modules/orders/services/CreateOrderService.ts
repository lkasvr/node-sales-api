// Typeorm
import { getCustomRepository } from 'typeorm';
import { OrdersRepository } from '../typeorm/repositories/OrdersRepository';
import { CustomersRepository } from '@modules/customers/typeorm/repositories/CustomersRepository';
import { ProductRepository } from '@modules/products/typeorm/repositories/ProductsRepository';
// App
import Order from '../typeorm/entities/Order';
import AppError from '@shared/errors/AppError';

type Product = {
  id: string;
  quantity: number;
};

interface IRequest {
  customer_id: string;
  products: Product[];
}

class CreateOrderService {
  public async execute({ customer_id, products }: IRequest): Promise<Order> {
    const ordersRepository = getCustomRepository(OrdersRepository);
    const customersRepository = getCustomRepository(CustomersRepository);
    const productsRepository = getCustomRepository(ProductRepository);

    const customerExists = await customersRepository.findById(customer_id);

    if (!customerExists)
      throw new AppError(`Couldn't find any customer with the given id`);

    const existsProducts = await productsRepository.findAllByIds(products);

    if (!existsProducts.length)
      throw new AppError(`Couldn't find any products with the given ids`);

    const existsProductsIds = existsProducts.map(product => product.id);

    const checkNonexistentProducts = products.filter(
      product => !existsProductsIds.includes(product.id),
    );

    if (checkNonexistentProducts.length)
      throw new AppError(
        `Couldn't find product ${checkNonexistentProducts[0].id}`,
      );

    const quantityAvailable = products.filter(
      product =>
        existsProducts.filter(p => p.id === product.id)[0].quantity <
        product.quantity,
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

    const order = await ordersRepository.createOrder({
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

    await productsRepository.save(updatedProductQuantity);

    return order;
  }
}

export default CreateOrderService;
