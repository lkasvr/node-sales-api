import 'reflect-metadata';
import CreateProductService from './CreateProductService';
import ShowProductService from './ShowProductService';
import FakeCustomersRepository from '../domain/repositories/fakes/FakesProductRepository';
import { IProduct } from '../domain/models/IProduct';
import AppError from '@shared/errors/AppError';

let fakeCustomerRepository: FakeCustomersRepository;
let createProduct: CreateProductService;
let showProduct: ShowProductService;
let product: IProduct;

describe('ShowProduct', () => {
  beforeEach(async () => {
    fakeCustomerRepository = new FakeCustomersRepository();
    createProduct = new CreateProductService(fakeCustomerRepository);
    showProduct = new ShowProductService(fakeCustomerRepository);

    product = await createProduct.execute({
      name: 'Produto 1',
      price: 10.5,
      quantity: 15
    });
  });

  it(`should return a specific user identified by id`, async () => {
    const returnedProduct = await showProduct.execute({ id: product.id });

    expect(returnedProduct.id).toEqual(product.id);
  });

  it(`should return an AppError instance for non-existent product `, () => {
    expect(showProduct.execute({ id: '' })).rejects.toBeInstanceOf(AppError);
  });
});
