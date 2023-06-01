// Typeorm
import { getCustomRepository } from 'typeorm';
import { ProductRepository } from '../typeorm/repositories/ProductsRepository';
// App
import AppError from '@shared/errors/AppError';
// Cache
// Cache
import RedisCache from '@shared/cache/RedisCache';
import { productListKey } from './redis.keys';

interface IRequest {
  id: string;
}

class DeleteProductService {
  public async execute({ id }: IRequest): Promise<void> {
    const productsRepository = getCustomRepository(ProductRepository);
    const product = await productsRepository.findOne(id);

    if (!product) throw new AppError('Product not found.');

    const redisCache = new RedisCache();

    await redisCache.invalidate(productListKey);

    await productsRepository.remove(product);
  }
}

export default DeleteProductService;
