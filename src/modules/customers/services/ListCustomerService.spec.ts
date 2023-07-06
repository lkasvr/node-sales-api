import 'reflect-metadata';
import ListCustomerService from './ListCustomerService';
import CreateCustomerService from './CreateCustomerService';
import FakeCustomersRepository from '../domain/repositories/fakes/FakesCustomerRepository';
import { ICustomer } from '../domain/models/ICustomer';
import AppError from '@shared/errors/AppError';

let fakeCustomerRepository: FakeCustomersRepository;
let listCustomer: ListCustomerService;
let customer: ICustomer

describe('ListCustomer', () => {
  beforeEach(async () => {
    fakeCustomerRepository = new FakeCustomersRepository();
    listCustomer = new ListCustomerService(fakeCustomerRepository);
  });

  it(`should list all user's`, async () => {
    const page = 2, limit = 2;
    const skip = (Number(page) - 1) * limit;

    const customers = await listCustomer.execute({ page, limit });
    expect(customers).toMatchObject({
      per_page: page,
      total: skip,
      current_page: limit,
      data: [
        ...customers.data
      ],
    })
  });
});
