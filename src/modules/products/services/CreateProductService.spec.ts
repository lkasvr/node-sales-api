import 'reflect-metadata';
import CreateProductService from './CreateProductService';
import FakesProductRepository from '../domain/repositories/fakes/FakesProductRepository';
import AppError from '@shared/errors/AppError';

let fakeProductRepository: FakesProductRepository;
let createProduct: CreateProductService;

describe('CreateProduct', () => {
  beforeEach(async () => {
    fakeProductRepository = new FakesProductRepository();
    createProduct = new CreateProductService(fakeProductRepository);
  });

  it('Should be able to create a new product', async () => {
    const product = await createProduct.execute({
      name: 'Produto 1',
      price: 10.5,
      quantity: 15
    });

    expect(product).toHaveProperty('id');
  });

  it('Should not create a new product with duplicate name', async () => {
    await createProduct.execute({
      name: 'Produto 1',
      price: 10.5,
      quantity: 15
    });

    expect(createProduct.execute({
      name: 'Produto 1',
      price: 10.5,
      quantity: 15
    })).rejects.toBeInstanceOf(AppError);
  });
});
