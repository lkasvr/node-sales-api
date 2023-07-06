import 'reflect-metadata';
import CreateCustomerService from './CreateCustomerService';
import ShowCustomerService from './ShowCustomerService';
import FakeCustomersRepository from '../domain/repositories/fakes/FakesCustomerRepository';
import AppError from '@shared/errors/AppError';
import { ICustomer } from '../domain/models/ICustomer';

let fakeCustomerRepository: FakeCustomersRepository;
let showCustomer: ShowCustomerService;
let createCustomer: CreateCustomerService;
let customer: ICustomer

describe('ShowCustomer', () => {
  beforeEach(async () => {
    fakeCustomerRepository = new FakeCustomersRepository();
    showCustomer = new ShowCustomerService(fakeCustomerRepository);
    createCustomer = new CreateCustomerService(fakeCustomerRepository);

    customer = await createCustomer.execute({
      name: 'Marcos Vieira',
      email: 'marcimo@hotmail123.com',
    });
  });

  it(`should return a specific user identified by id `, async () => {
    const returnedCustomer = await showCustomer.execute({ id: customer.id })
    expect(returnedCustomer.id).toEqual(customer.id);
  });

  it(`should return an AppError instance for non-existent customer `, () => {
    expect(showCustomer.execute({ id: '' })).rejects.toBeInstanceOf(AppError);
  });
});
