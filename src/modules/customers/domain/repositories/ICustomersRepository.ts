import { ICustomer } from '../models/ICustomer';
import { ICustomerPaginate } from '../models/ICustomerPaginate';
import { ICreateCustomer } from '../models/ICreateCustomer';

export type SearchParams = {
  page: number;
  skip: number;
  take: number;
};

export interface ICustomersRepository {
  findAll({ page, skip, take }: SearchParams): Promise<ICustomerPaginate>;
  findByName(name: string): Promise<ICustomer | undefined>;
  findById(id: string): Promise<ICustomer | undefined>;
  findByEmail(email: string): Promise<ICustomer | undefined>;
  create(data: ICreateCustomer): Promise<ICustomer>;
  save(customer: ICustomer): Promise<ICustomer>;
  remove(id: ICustomer): Promise<void>;
}
