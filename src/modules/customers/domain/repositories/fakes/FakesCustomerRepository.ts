import { v4 as uuidv4 } from 'uuid';
import Customer from '@modules/customers/infra/typeorm/entities/Customer';
import {
  ICustomersRepository,
  SearchParams,
} from '@modules/customers/domain/repositories/ICustomersRepository';
import { ICreateCustomer } from '@modules/customers/domain/models/ICreateCustomer';
import { IDeleteCustomer } from '@modules/customers/domain/models/IDeleteCustomer';
import { ICustomerPaginate } from '@modules/customers/domain/models/ICustomerPaginate';
import { ICustomer } from '../../models/ICustomer';

const getCustomer = (args: Array<string>) => ({
  id: uuidv4(),
  name: args[0],
  email: args[1],
  created_at: new Date(),
  updated_at: new Date(),
});

const getCustomerPaginate = (args: Array<number>) => ({
  per_page: args[0] && 1,
  total: args[1] && 1,
  current_page: args[2] && 1,
  data: [
    getCustomer(['Carlos', 'carlos@.com']),
    getCustomer(['Lucas', 'lucas@.com']),
  ],
});

class FakeCustomersRepository implements ICustomersRepository {
  private customers: Customer[] = [];

  public async create({ name, email }: ICreateCustomer): Promise<Customer> {
    const customer = new Customer();

    customer.id = uuidv4();
    customer.name = name;
    customer.email = email;

    this.customers.push(customer);

    return customer;
  }

  public async save(customer: Customer): Promise<Customer> {
    const findIndex = this.customers.findIndex(
      findCustomer => findCustomer.id === customer.id,
    );

    this.customers[findIndex] = customer;

    return customer;
  }

  public async remove({ id }: IDeleteCustomer): Promise<void> {
    const findIndex = this.customers.findIndex(
      findCustomer => findCustomer.id === id,
    );

    this.customers.splice(findIndex, 1);
  }

  public async findAll({
    page,
    skip,
    take,
  }: SearchParams): Promise<ICustomerPaginate> {
    return getCustomerPaginate([page, skip, take]);
  }

  public async findByName(name: string): Promise<Customer | undefined> {
    const customer = this.customers.find(customer => customer.name === name);
    return customer;
  }

  public async findById(id: string): Promise<Customer | undefined> {
    const customer = this.customers.find(customer => customer.id === id);
    return customer;
  }

  public async findByEmail(email: string): Promise<Customer | undefined> {
    const customer = this.customers.find(customer => customer.email === email);
    return customer;
  }
}

export default FakeCustomersRepository;
