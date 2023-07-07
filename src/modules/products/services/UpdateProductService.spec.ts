import 'reflect-metadata';
import CreateProductService from './CreateProductService';
import UpdateProductService from './UpdateProductService';
import FakeCustomersRepository from '../domain/repositories/fakes/FakesProductRepository';
import { IProduct } from '../domain/models/IProduct';
import AppError from '@shared/errors/AppError';

let fakeCustomerRepository: FakeCustomersRepository;
let createProduct: CreateProductService;
let updateProduct: UpdateProductService;
let product: IProduct;

describe('UpdateProduct', () => {
  beforeEach(async () => {
    fakeCustomerRepository = new FakeCustomersRepository();
    createProduct = new CreateProductService(fakeCustomerRepository);
    updateProduct = new UpdateProductService(fakeCustomerRepository);

    product = await createProduct.execute({
      name: 'Produto 1',
      price: 10.5,
      quantity: 15
    });
  });

  it(`should return a specific user identified by id`, async () => {
    const name = 'Produto A', price = 55.2, quantity = 12;


    const returnedProduct = await updateProduct.execute({ id: product.id, name, price, quantity });

    expect(returnedProduct).toMatchObject({
      id: product.id,
      name,
      price,
      quantity
    });
  });

  it(`should return an AppError instance for non-existent product`, () => {
    const name = '', price = 55.2, quantity = 12;

    expect(updateProduct.execute({ id: '', name, price, quantity })).rejects.toBeInstanceOf(AppError);
  });

  it(`should return an AppError instance if there is another product with the same name`, async () => {
    const anotherProduct = await createProduct.execute({
      name: 'Produto 2',
      price: 10.5,
      quantity: 15
    });

    expect(updateProduct.execute({ id: product.id, name: anotherProduct.name, price: 1, quantity: 1 })).rejects.toBeInstanceOf(AppError);
  });
});
