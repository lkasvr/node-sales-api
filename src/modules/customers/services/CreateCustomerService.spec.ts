import 'reflect-metadata';
import CreateCustomerService from './CreateCustomerService';
import FakeCustomersRepository from '../domain/repositories/fakes/FakesCustomerRepository';
import AppError from '@shared/errors/AppError';

let fakeCustomerRepository: FakeCustomersRepository;
let createCustomer: CreateCustomerService;

describe('CreateCustomer', () => {
  beforeEach(() => {
    fakeCustomerRepository = new FakeCustomersRepository();
    createCustomer = new CreateCustomerService(fakeCustomerRepository);
  });

  it('Should be able to create a new customer', async () => {
    const customer = await createCustomer.execute({
      name: 'Marcos Vieira',
      email: 'marcimo@hotmail123.com',
    });

    expect(customer).toHaveProperty('id');
  });

  it('Should not be able to create a customer with the same email address', async () => {
    await createCustomer.execute({
      name: 'Marcos Vieira',
      email: 'marcimo@hotmail123.com',
    });
    expect(
      createCustomer.execute({
        name: 'Marcos Vieira',
        email: 'marcimo@hotmail123.com',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
