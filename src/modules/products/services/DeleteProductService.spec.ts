import 'reflect-metadata';
import FakesProductRepository from '../domain/repositories/fakes/FakesProductRepository';
import DeleteProductService from './DeleteProductService';
import CreateProductService from './CreateProductService';
import { IProduct } from '../domain/models/IProduct';
import AppError from '@shared/errors/AppError';

let fakeProductRepository: FakesProductRepository;
let createProduct: CreateProductService;
let deleteProduct: DeleteProductService;
let product: IProduct;

describe('DeleteProduct', () => {
  beforeEach(async () => {
    fakeProductRepository = new FakesProductRepository();
    createProduct = new CreateProductService(fakeProductRepository);
    deleteProduct = new DeleteProductService(fakeProductRepository);
  });

  it('Should be able to delete an product', async () => {
    product = await createProduct.execute({
      name: 'Produto 1',
      price: 10.5,
      quantity: 15
    });

    expect(product).toHaveProperty('id');

    await deleteProduct.execute({ id: product.id });

    expect(deleteProduct.execute({ id: product.id })).rejects.toBeInstanceOf(AppError);
  });

  it('Should not be able to delete an nonexistent product', () => {
    expect(deleteProduct.execute({ id: product.id })).rejects.toBeInstanceOf(AppError);
  });
});
