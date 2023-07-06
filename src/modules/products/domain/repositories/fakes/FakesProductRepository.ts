import { v4 as uuidv4 } from 'uuid';
import Product from '@modules/products/infra/typeorm/entities/Product';
import { IProductsRepository } from '@modules/products/domain/repositories/IProductsRepository';
import { ICreateProduct } from '../../models/ICreateProduct';
import { IUpdateStockProduct } from '../../models/IUpdateStockProduct';
import { IFindProducts } from '../../models/IFindProducts';

// const getProduct = (args: Array<string>) => ({
//   id: uuidv4(),
//   name: args[0],
//   price: args[1],
//   quantity: args[2],
//   created_at: new Date(),
//   updated_at: new Date(),
// });

class FakeProductRepository implements IProductsRepository {
  private products: Product[] = [];

  public async create({ name, price, quantity }: ICreateProduct): Promise<Product> {
    const product = new Product();

    product.id = uuidv4();
    product.name = name;
    product.price = price;
    product.quantity = quantity;

    this.products.push(product);

    return product;
  }

  public async save(product: Product): Promise<Product> {
    const findIndex = this.products.findIndex(
      findProduct => findProduct.id === product.id,
    );

    this.products[findIndex] = product;

    return product;
  }

  public async remove({ id }: Product): Promise<void> {
    const findIndex = this.products.findIndex(
      findProduct => findProduct.id === id,
    );

    this.products.splice(findIndex, 1);
  }

  public async updateStock(products: IUpdateStockProduct[]): Promise<void> {
    products.forEach(({ id, quantity }) => {
      const findIndex = this.products.findIndex(
        findProduct => findProduct.id === id,
      );

      this.products[findIndex].quantity = quantity;
    });
  }

  public async findByName(name: string): Promise<Product | undefined> {
    const product = this.products.find(product => product.name === name);
    return product;
  }

  public async findById(id: string): Promise<Product | undefined> {
    const product = this.products.find(product => product.id === id);
    return product;
  }

  public async findAll(): Promise<Product[]> {
    return { ...this.products };
  }

  public async findAllByIds(products: IFindProducts[]): Promise<Product[]> {
    const productsIds = products.map(product => product.id);

    const existentProducts = productsIds.map((id) => {
      const findIndex = this.products.findIndex(
        findProduct => findProduct.id === id,
      );

      return this.products[findIndex];
    });

    return existentProducts;
  }
}

export default FakeProductRepository;
