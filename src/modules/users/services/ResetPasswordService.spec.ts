import 'reflect-metadata';
import CreateUserService from './CreateUserService';
import SendForgotPasswordEmailService from './SendForgotPasswordEmailService';
import ResetPasswordService from './ResetPasswordService';
import FakeUsersRepository from '@modules/users/domain/repositories/fakes/FakeUsersRepository';
import FakeUserTokensRepository from '@modules/users/domain/repositories/fakes/FakeUserTokensRepository';
import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider';
import { IUser } from '../domain/models/IUser';
import AppError from '@shared/errors/AppError';
// Util's
import { compare } from 'bcryptjs';

let fakeUserRepository: FakeUsersRepository;
let fakeUserTokensRepository: FakeUserTokensRepository;
let fakeHashProvider: FakeHashProvider;
let createUser: CreateUserService;
let resetPassword: ResetPasswordService;

let user: IUser;
let password: string;

describe('ResetPassword', () => {
  beforeEach(async () => {
    fakeUserRepository = new FakeUsersRepository();
    fakeUserTokensRepository = new FakeUserTokensRepository();
    fakeHashProvider = new FakeHashProvider();

    createUser = new CreateUserService(fakeUserRepository, fakeHashProvider);
    resetPassword = new ResetPasswordService(fakeUserRepository, fakeUserTokensRepository);

    user = await createUser.execute({
      name: 'Marcos Vieira',
      email: 'marcimo123456@hotmail.com',
      password: '123456',
    });

    expect(user).toHaveProperty('id');
    password = '78910';
  });

  it('should reset user password', async () => {
    const { token } = await fakeUserTokensRepository.generate(user.id);
    await resetPassword.execute({ password, token });

    const isResetPassword = await compare(password, user.password);

    expect(isResetPassword).toBeTruthy();
  });

  it('should return an AppError instance for non-existent user token', async () => {
    expect(resetPassword.execute({ password, token: '' })).rejects.toBeInstanceOf(AppError);
  });

  it('should return an AppError instance for non-existent user', async () => {
    const { token } = await fakeUserTokensRepository.generate('12345');

    expect(resetPassword.execute({ password, token })).rejects.toBeInstanceOf(AppError);
  });

  it('should return an AppError instance for a expired token', async () => {
    expect(resetPassword.execute({ password, token: '9876' })).rejects.toBeInstanceOf(AppError);
  });
});
