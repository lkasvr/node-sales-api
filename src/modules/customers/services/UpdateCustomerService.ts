// App
import AppError from '@shared/errors/AppError';
import { inject, injectable } from 'tsyringe';
import Customer from '../infra/typeorm/entities/Customer';
import { ICustomersRepository } from '../domain/repositories/ICustomersRepository';
import { IUpdateCustomer } from '../domain/models/IUpdateCustomers';

@injectable()
class UpdateCustomerService {
  constructor(
    @inject('CustomersRepository')
    private customersRepository: ICustomersRepository,
  ) {}

  public async execute({
    id,
    name,
    email,
  }: IUpdateCustomer): Promise<Customer> {
    const customer = await this.customersRepository.findById(id);

    if (!customer) throw new AppError('User not found');

    const customerExists = await this.customersRepository.findByEmail(email);

    if (customerExists && email !== customer.email)
      throw new AppError('There is already one customer with that email.');

    customer.name = name;
    customer.email = email;

    await this.customersRepository.save(customer);

    return customer;
  }
}

export default UpdateCustomerService;
