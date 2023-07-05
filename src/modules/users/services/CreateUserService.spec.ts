import 'reflect-metadata';
import CreateUserService from './CreateUserService';
import FakeUsersRepository from '@modules/users/domain/repositories/fakes/FakeUsersRepository';
import AppError from '@shared/errors/AppError';
import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider';

let fakeUserRepository: FakeUsersRepository;
let createUser: CreateUserService;
let fakeHashProvider: FakeHashProvider;

describe('CreateUser', () => {
  beforeEach(() => {
    fakeUserRepository = new FakeUsersRepository();
    fakeHashProvider = new FakeHashProvider();
    createUser = new CreateUserService(fakeUserRepository, fakeHashProvider);
  });

  it('Should be able to create a new user', async () => {
    const user = await createUser.execute({
      name: 'Marcos Vieira',
      email: 'marcimo@hotmail123.com',
      password: '123456',
    });

    expect(user).toHaveProperty('id');
  });

  it('Should not be able to create two users with the same email address', async () => {
    await createUser.execute({
      name: 'Marcos Vieira',
      email: 'marcimo@hotmail123.com',
      password: '123456',
    });
    expect(
      createUser.execute({
        name: 'Marcos Vieira',
        email: 'marcimo@hotmail123.com',
        password: '123456',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
