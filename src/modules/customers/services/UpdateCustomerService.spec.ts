import 'reflect-metadata';
import CreateCustomerService from './CreateCustomerService';
import UpdateCustomerService from './UpdateCustomerService';
import FakeCustomersRepository from '../domain/repositories/fakes/FakesCustomerRepository';
import AppError from '@shared/errors/AppError';
import { ICustomer } from '../domain/models/ICustomer';

let fakeCustomerRepository: FakeCustomersRepository;
let updateCusomer: UpdateCustomerService;
let createCustomer: CreateCustomerService;
let customer: ICustomer

describe('UpdateCustomer', () => {
  beforeEach(async () => {
    fakeCustomerRepository = new FakeCustomersRepository();
    updateCusomer = new UpdateCustomerService(fakeCustomerRepository);
    createCustomer = new CreateCustomerService(fakeCustomerRepository);

    customer = await createCustomer.execute({
      name: 'Marcos Vieira',
      email: 'marcimo@hotmail123.com',
    });
  });

  it(`should update an specific user identified by id`, async () => {
    const name = 'Marcos', email = 'marcio456@outlook.com';

    const returnedCustomer = await updateCusomer.execute({ id: customer.id, name, email })

    expect(returnedCustomer).toMatchObject({
      id: customer.id,
      name,
      email
    });
  });

  it(`should return an AppError instance for non-existent customer`, () => {
    const name = '', email = '';

    expect(updateCusomer.execute({ id: '', name, email })).rejects.toBeInstanceOf(AppError);
  });

  it(`should return an AppError instance if there is another customer with the same email`, async () => {
    const anotherCustomer = await createCustomer.execute({
      name: 'Lucas Vieira',
      email: 'lkasvr@hotmail123.com',
    });
    const name = '';

    expect(updateCusomer.execute({ id: customer.id, name, email: anotherCustomer.email })).rejects.toBeInstanceOf(AppError);
  });
});
