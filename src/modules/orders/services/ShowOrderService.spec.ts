import 'reflect-metadata';
import ShowOrderService from './ShowOrderService';
import CreateOrderService from './CreateOrderService';
import CreateCustomerService from '@modules/customers/services/CreateCustomerService';
import CreateProductService from '@modules/products/services/CreateProductService';
import FakeOrdersRepository from '../domain/repositories/fakes/FakeOrdersRepository';
import FakesCustomerRepository from '@modules/customers/domain/repositories/fakes/FakesCustomerRepository';
import FakeProductRepository from '@modules/products/domain/repositories/fakes/FakesProductRepository';
import AppError from '@shared/errors/AppError';
import { ICustomer } from '@modules/customers/domain/models/ICustomer';
import { IProduct } from '@modules/products/domain/models/IProduct';
import { IOrder } from '../domain/models/IOrder';

let fakeOrdersRepository: FakeOrdersRepository;
let fakesCustomerRepository: FakesCustomerRepository;
let fakesProductRepository: FakeProductRepository;
let showOrder: ShowOrderService;
let createOrder: CreateOrderService;
let createCustomer: CreateCustomerService;
let createProduct: CreateProductService;
let customer: ICustomer;
let product: IProduct;
let order: IOrder;

describe('ShowOrder', () => {
  beforeEach(async () => {
    fakeOrdersRepository = new FakeOrdersRepository();
    fakesCustomerRepository = new FakesCustomerRepository();
    fakesProductRepository = new FakeProductRepository();

    showOrder = new ShowOrderService(fakeOrdersRepository);
    createOrder = new CreateOrderService(fakeOrdersRepository, fakesCustomerRepository, fakesProductRepository);
    createCustomer = new CreateCustomerService(fakesCustomerRepository);
    createProduct = new CreateProductService(fakesProductRepository);

    customer = await createCustomer.execute({
      name: 'Customer Create to Test Order',
      email: 'order@hotmail123.com',
    });

    product = await createProduct.execute({ name: 'Test Product', price: 10, quantity: 5 });
    order = await createOrder.execute({ customer_id: customer.id, products: [product] });

  });

  it('Should be able to show order', async () => {
    const theOrder = await showOrder.execute({ id: order.id });
    expect(theOrder).toMatchObject(order);
  });

  it('Should be able to show an AppError instance for non-existent order', () => {
    expect(showOrder.execute({ id: '' })).rejects.toBeInstanceOf(AppError);
  });

});
