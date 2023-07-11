import 'reflect-metadata';
import CreateUserService from './CreateUserService';
import UpdateUserAvatarService from './UpdateUserAvatarService';
import FakeUsersRepository from '../domain/repositories/fakes/FakeUsersRepository';
import FakeHashProvider from '@modules/users/providers/HashProvider/fakes/FakeHashProvider';
import AppError from '@shared/errors/AppError';
import { IUser } from '../domain/models/IUser';

jest.useFakeTimers();
import upload from '@config/upload'

let fakeUserRepository: FakeUsersRepository;
let fakeHashProvider: FakeHashProvider;
let createUser: CreateUserService;
let updateUserAvatar: UpdateUserAvatarService;
let user: IUser

describe('UpdateCustomer', () => {
  beforeEach(async () => {
    fakeUserRepository = new FakeUsersRepository();
    fakeHashProvider = new FakeHashProvider();
    updateUserAvatar = new UpdateUserAvatarService(fakeUserRepository);
    createUser = new CreateUserService(fakeUserRepository, fakeHashProvider);

    user = await createUser.execute({
      name: 'Marcos Vieira',
      email: 'marcin@hotmail.com',
      password: '123456'
    });
  });

  it(`should return an AppError instance for non-existent user`, () => {
    expect(updateUserAvatar.execute({ user_id: '', avatarFilename: '' })).rejects.toBeInstanceOf(AppError);
  });
});
