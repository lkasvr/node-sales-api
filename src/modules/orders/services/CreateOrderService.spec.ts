import 'reflect-metadata';
import CreateOrderService from './CreateOrderService';
import CreateCustomerService from '@modules/customers/services/CreateCustomerService';
import CreateProductService from '@modules/products/services/CreateProductService';
import FakeOrdersRepository from '../domain/repositories/fakes/FakeOrdersRepository';
import FakesCustomerRepository from '@modules/customers/domain/repositories/fakes/FakesCustomerRepository';
import FakeProductRepository from '@modules/products/domain/repositories/fakes/FakesProductRepository';
import AppError from '@shared/errors/AppError';
import { ICustomer } from '@modules/customers/domain/models/ICustomer';
import { IProduct } from '@modules/products/domain/models/IProduct';

let fakeOrdersRepository: FakeOrdersRepository;
let fakesCustomerRepository: FakesCustomerRepository;
let fakesProductRepository: FakeProductRepository
let createOrder: CreateOrderService;
let createCustomer: CreateCustomerService;
let createProduct: CreateProductService;
let customer: ICustomer;
let product: IProduct;

describe('CreateOrder', () => {
  beforeEach(async () => {
    fakeOrdersRepository = new FakeOrdersRepository();
    fakesCustomerRepository = new FakesCustomerRepository();
    fakesProductRepository = new FakeProductRepository();

    createOrder = new CreateOrderService(fakeOrdersRepository, fakesCustomerRepository, fakesProductRepository);
    createCustomer = new CreateCustomerService(fakesCustomerRepository);
    createProduct = new CreateProductService(fakesProductRepository);

    customer = await createCustomer.execute({
      name: 'Customer Create to Test Order',
      email: 'order@hotmail123.com',
    });

    product = await createProduct.execute({ name: 'Test Product', price: 10, quantity: 5 });

  });

  it('Should be able to create a new order', async () => {
    const otherProduct = await createProduct.execute({ name: 'Test Product 2', price: 2, quantity: 20 });

    const order = await createOrder.execute({ customer_id: customer.id, products: [product, otherProduct] });

    expect(order).toHaveProperty('id');
  });

  it('Should not be able to create a new order without products', () => {
    expect(createOrder.execute({ customer_id: customer.id, products: [] })).rejects.toBeInstanceOf(AppError);
  });

  it('check conditional statement checkNonexistentProducts', () => {
    expect(
      createOrder.execute({ customer_id: customer.id, products: [product, { id: '098xas#*123sdad' }] })
    )
      .rejects
      .toBeInstanceOf(AppError);
  });

  it('Should not be able to create a new order without quantity product', async () => {
    const otherProduct = await createProduct.execute({ name: 'Test Product 2', price: 2, quantity: 0 });

    expect(
      createOrder.execute({ customer_id: customer.id, products: [product, otherProduct] })
    )
      .rejects
      .toBeInstanceOf(AppError);
  });

  it('Should not be able to create a new order by non-existent user', () => {
    expect(createOrder.execute({ customer_id: '', products: [] })).rejects.toBeInstanceOf(AppError);
  });
});
