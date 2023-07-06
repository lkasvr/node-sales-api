import 'reflect-metadata';
import FakeCustomersRepository from '../domain/repositories/fakes/FakesCustomerRepository';
import DeleteCustomerService from './DeleteCustomerService';
import CreateCustomerService from './CreateCustomerService';
import AppError from '@shared/errors/AppError';
import { ICustomer } from '../domain/models/ICustomer';

let fakeCustomerRepository: FakeCustomersRepository;
let deleteCustomer: DeleteCustomerService;
let createCustomer: CreateCustomerService;
let customer: ICustomer

describe('DeleteCustomer', () => {
  beforeEach(() => {
    fakeCustomerRepository = new FakeCustomersRepository();
    deleteCustomer = new DeleteCustomerService(fakeCustomerRepository);
    createCustomer = new CreateCustomerService(fakeCustomerRepository);
  });

  it('Should be able to delete a existent customer', async () => {
    customer = await createCustomer.execute({
      name: 'Marcos Vieira',
      email: 'marcimo@hotmail123.com',
    });

    expect(customer).toHaveProperty('id');

    await deleteCustomer.execute({ id: customer.id });

    expect(deleteCustomer.execute({ id: customer.id })).rejects.toBeInstanceOf(AppError);
  });

  it('Should not be able to delete an nonexistent customer', () => {
    expect(deleteCustomer.execute({ id: customer.id })).rejects.toBeInstanceOf(AppError);
  });
});
