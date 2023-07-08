import 'reflect-metadata';
import FakeUsersRepository from '@modules/users/domain/repositories/fakes/FakeUsersRepository';
import CreateUserService from './CreateUserService';
import ShowProfileService from './ShowProfileService';
import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider';
import { IUser } from '../domain/models/IUser';
import AppError from '@shared/errors/AppError';

let fakeUserRepository: FakeUsersRepository;
let showProfile: ShowProfileService;
let createUser: CreateUserService;
let fakeHashProvider: FakeHashProvider;
let user: IUser

describe('ShowProfile', () => {
  beforeEach(async () => {
    fakeUserRepository = new FakeUsersRepository();
    fakeHashProvider = new FakeHashProvider();
    showProfile = new ShowProfileService(fakeUserRepository);
    createUser = new CreateUserService(fakeUserRepository, fakeHashProvider);

    user = await createUser.execute({
      name: 'Marcos Vieira',
      email: 'marcin@hotmail.com',
      password: '123456'
    });
  });

  it(`should return a specific user profile from user id`, async () => {
    const returnedUser = await showProfile.execute({ user_id: user.id })
    expect(returnedUser.id).toEqual(user.id);
  });

  it(`should return an AppError instance for non-existent user `, () => {
    expect(showProfile.execute({ user_id: '' })).rejects.toBeInstanceOf(AppError);
  });
});
