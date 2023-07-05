import { Request, Response } from 'express';
import { container } from 'tsyringe';
// Services
import ListCustomerService from '@modules/customers/services/ListCustomerService';
import ShowCustomerService from '@modules/customers/services/ShowCustomerService';
import CreateCustomerService from '@modules/customers/services/CreateCustomerService';
import UpdateCustomerService from '@modules/customers/services/UpdateCustomerService';
import DeleteCustomerService from '@modules/customers/services/DeleteCustomerService';

export default class CustomersController {
  public async index(req: Request, res: Response): Promise<Response> {
    const page = req.query.page ? Number(req.query.page) : 1;
    const limit = req.query.limit ? Number(req.query.limit) : 15;

    const listCustomers = container.resolve(ListCustomerService);

    const customers = await listCustomers.execute({ page, limit });

    return res.json(customers);
  }

  public async show(req: Request, res: Response): Promise<Response> {
    const { id } = req.params;

    const showCustomer = container.resolve(ShowCustomerService);

    const customer = await showCustomer.execute({ id });

    return res.json(customer);
  }

  public async create(req: Request, res: Response): Promise<Response> {
    const { name, email } = req.body;

    const createCustomer = container.resolve(CreateCustomerService);

    const customer = await createCustomer.execute({
      name,
      email,
    });

    return res.json(customer);
  }

  public async update(req: Request, res: Response): Promise<Response> {
    const { name, email } = req.body;
    const { id } = req.params;
    const updateCustomer = container.resolve(UpdateCustomerService);

    const customer = await updateCustomer.execute({
      id,
      name,
      email,
    });

    return res.json(customer);
  }

  public async delete(req: Request, res: Response): Promise<Response> {
    const { id } = req.params;

    const deleteCustomer = container.resolve(DeleteCustomerService);

    await deleteCustomer.execute({ id });

    return res.json([]);
  }
}
