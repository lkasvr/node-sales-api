import 'reflect-metadata';
import FakeUsersRepository from '@modules/users/domain/repositories/fakes/FakeUsersRepository';
import AppError from '@shared/errors/AppError';
import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider';
import CreateSessionsService from './CreateSessionsService';

let fakeUserRepository: FakeUsersRepository;
let createSession: CreateSessionsService;
let fakeHashProvider: FakeHashProvider;

describe('CreateSession', () => {
  beforeEach(() => {
    fakeUserRepository = new FakeUsersRepository();
    fakeHashProvider = new FakeHashProvider();
    createSession = new CreateSessionsService(
      fakeUserRepository,
      fakeHashProvider,
    );
  });

  it('Should be able to authenticate', async () => {
    const user = await fakeUserRepository.create({
      name: 'Marcos Vieira',
      email: 'marcimo@hotmail123.com',
      password: '123456',
    });

    const response = await createSession.execute({
      email: 'marcimo@hotmail123.com',
      password: '123456',
    });

    expect(response.session).toHaveProperty('token');
    expect(response.session.user).toEqual(user);
  });

  it('Should not be able to authenticate with non existent user', async () => {
    expect(
      createSession.execute({
        email: 'marcimo@hotmail123.com',
        password: '123456',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('Should not be able to authenticate with wrong password', async () => {
    await fakeUserRepository.create({
      name: 'Marcos Vieira',
      email: 'marcimo@hotmail123.com',
      password: '123456',
    });

    expect(
      createSession.execute({
        email: 'marcimo@hotmail123.com',
        password: '56789',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
