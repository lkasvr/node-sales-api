import 'reflect-metadata';
jest.useFakeTimers();

import CreateUserService from './CreateUserService';
import UpdateUserAvatarService from './UpdateUserAvatarService';
import FakeUsersRepository from '../domain/repositories/fakes/FakeUsersRepository';
import FakeHashProvider from '@modules/users/providers/HashProvider/fakes/FakeHashProvider';
import FakeStorageProvider from '@shared/providers/StorageProvider/Fakes/FakeStorageProvider';
import { IUser } from '../domain/models/IUser';
import AppError from '@shared/errors/AppError';
import upload from '@config/upload';

let fakeUserRepository: FakeUsersRepository;
let fakeHashProvider: FakeHashProvider;
let fakeStorageProvider: FakeStorageProvider;
let createUser: CreateUserService;
let updateUserAvatar: UpdateUserAvatarService;
let user: IUser

describe('UpdateCustomer', () => {
  beforeEach(async () => {
    fakeUserRepository = new FakeUsersRepository();
    fakeHashProvider = new FakeHashProvider();
    fakeStorageProvider = new FakeStorageProvider();
    updateUserAvatar = new UpdateUserAvatarService(fakeUserRepository, fakeStorageProvider, fakeStorageProvider);
    createUser = new CreateUserService(fakeUserRepository, fakeHashProvider);

    user = await createUser.execute({
      name: 'Marcos Vieira',
      email: 'marcin@hotmail.com',
      password: '123456'
    });
  });

  it(`should return user with the avatar uploaded`, async () => {
    const avatarFilename = 'testAvatar.png';
    await updateUserAvatar.execute({ user_id: user.id, avatarFilename });
    expect(user.avatar).toEqual(avatarFilename);
  });

  it(`should return an AppError instance for non-existent user`, () => {
    expect(updateUserAvatar.execute({ user_id: '', avatarFilename: '' })).rejects.toBeInstanceOf(AppError);
  });

  it(`should test if branch with disk driver/provider`, async () => {
    const avatarFilename = 'testAvatar.png';
    upload.driver = 'disk';
    await updateUserAvatar.execute({ user_id: user.id, avatarFilename });
    expect(user.avatar).toEqual(avatarFilename);
  });
});
