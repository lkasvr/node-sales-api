import 'reflect-metadata';
import ListProductService from './ListProductService';
import FakeCustomersRepository from '../domain/repositories/fakes/FakesProductRepository';

let fakeCustomerRepository: FakeCustomersRepository;
let listProduct: ListProductService;

describe('ListProduct', () => {
  beforeEach(async () => {
    fakeCustomerRepository = new FakeCustomersRepository();
    listProduct = new ListProductService(fakeCustomerRepository);
  });

  it(`should list all product's`, async () => {

    const products = await listProduct.execute();

    products.forEach(product => {
      expect(product).toMatchObject(
        {
          id: expect.any(String),
          order_products: expect.any(Array),
          name: expect.any(String),
          price: expect.any(Number),
          quantity: expect.any(Number),
          created_at: expect.any(Date) || expect.any(String),
          updated_at: expect.any(Date) || expect.any(String)
        }
      );
    });
  });
});
