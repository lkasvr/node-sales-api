// Typeorm
import { getCustomRepository } from 'typeorm';
import { ProductRepository } from '../typeorm/repositories/ProductsRepository';
// App
import Product from '../typeorm/entities/Product';
import AppError from '@shared/errors/AppError';
// Cache
import RedisCache from '@shared/cache/RedisCache';
import { productListKey } from './redis.keys';

interface IRequest {
  name: string;
  price: number;
  quantity: number;
}

class CreateProductService {
  public async execute({ name, price, quantity }: IRequest): Promise<Product> {
    const productsRepository = getCustomRepository(ProductRepository);
    const productExists = await productsRepository.findByName(name);

    if (productExists)
      throw new AppError('There is already one product with that name');

    const redisCache = new RedisCache();

    const product = productsRepository.create({
      name,
      price,
      quantity,
    });

    await redisCache.invalidate(productListKey);

    await productsRepository.save(product);

    return product;
  }
}

export default CreateProductService;
