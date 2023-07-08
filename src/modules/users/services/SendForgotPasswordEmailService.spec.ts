import 'reflect-metadata';

import CreateUserService from './CreateUserService';
import SendForgotPasswordEmailService from './SendForgotPasswordEmailService';
import FakeUsersRepository from '@modules/users/domain/repositories/fakes/FakeUsersRepository';
import FakeUserTokensRepository from '@modules/users/domain/repositories/fakes/FakeUserTokensRepository';
import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider';
import { IUser } from '../domain/models/IUser';
import AppError from '@shared/errors/AppError';

jest.useFakeTimers();
import mail from '@config/mail/mail'

let fakeUserRepository: FakeUsersRepository;
let fakeUserTokensRepository: FakeUserTokensRepository;
let fakeHashProvider: FakeHashProvider;
let createUser: CreateUserService;
let sendForgotPasswordEmail: SendForgotPasswordEmailService;

let user: IUser;

describe('SendForgotPasswordEmail', () => {
  beforeEach(async () => {
    fakeUserRepository = new FakeUsersRepository();
    fakeUserTokensRepository = new FakeUserTokensRepository();
    fakeHashProvider = new FakeHashProvider();

    createUser = new CreateUserService(fakeUserRepository, fakeHashProvider);
    sendForgotPasswordEmail = new SendForgotPasswordEmailService(fakeUserRepository, fakeUserTokensRepository);

    user = await createUser.execute({
      name: 'Marcos Vieira',
      email: 'marcimo123456@hotmail.com',
      password: '123456',
    });

    expect(user).toHaveProperty('id');
  });

  it('should call a sendForgotPasswordEmail service', async () => {
    expect(sendForgotPasswordEmail.execute({ email: user.email })).resolves.toBeCalledTimes(1);
    expect(sendForgotPasswordEmail.execute({ email: user.email })).resolves.toBeCalledWith(user.email);
  });

  it('should call a sendForgotPasswordEmail service and test the conditional branch', async () => {
    mail.driver = 'ses'
    expect(sendForgotPasswordEmail.execute({ email: user.email })).resolves.toBeCalledTimes(1);
    expect(sendForgotPasswordEmail.execute({ email: user.email })).resolves.toBeCalledWith(user.email);
  });

  it('should return an instance of AppErro for non-existent user', async () => {
    expect(sendForgotPasswordEmail.execute({ email: '' })).rejects.toBeInstanceOf(AppError);
  });
});
