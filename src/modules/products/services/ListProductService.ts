// Typeorm
import { getCustomRepository } from 'typeorm';
import { ProductRepository } from '../typeorm/repositories/ProductsRepository';
// App
import Product from '../typeorm/entities/Product';
// Cache
import RedisCache from '@shared/cache/RedisCache';
import { productListKey } from './redis.keys';

class ListProductService {
  public async execute(): Promise<Product[]> {
    const productsRepository = getCustomRepository(ProductRepository);

    const redisCache = new RedisCache();

    let products = await redisCache.recover<Product[]>(productListKey);

    if (!products) {
      products = await productsRepository.find();

      await redisCache.save(productListKey, products);
    }

    return products;
  }
}

export default ListProductService;
