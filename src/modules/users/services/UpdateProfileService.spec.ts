import 'reflect-metadata';
import CreateUserService from './CreateUserService';
import UpdateProfileService from './UpdateProfileService';
import FakeUsersRepository from '../domain/repositories/fakes/FakeUsersRepository';
import FakeHashProvider from '@modules/users/providers/HashProvider/fakes/FakeHashProvider';
import AppError from '@shared/errors/AppError';
import { IUser } from '../domain/models/IUser';

let fakeUserRepository: FakeUsersRepository;
let fakeHashProvider: FakeHashProvider;
let createUser: CreateUserService;
let updateProfile: UpdateProfileService;
let user: IUser

describe('UpdateProfile', () => {
  beforeEach(async () => {
    fakeUserRepository = new FakeUsersRepository();
    fakeHashProvider = new FakeHashProvider();
    updateProfile = new UpdateProfileService(fakeUserRepository);
    createUser = new CreateUserService(fakeUserRepository, fakeHashProvider);

    user = await createUser.execute({
      name: 'Marcos Vieira',
      email: 'marcin@hotmail.com',
      password: '123456'
    });
  });

  it(`should update an specific profile user identified by id`, async () => {
    const name = 'Marcos', email = 'marcio456@outlook.com';

    const returnedUser = await updateProfile.execute({ user_id: user.id, name, email })

    expect(returnedUser).toMatchObject({
      id: user.id,
      name,
      email
    });
  });

  it(`should return an AppError instance for non-existent user`, () => {
    const name = '', email = '';

    expect(updateProfile.execute({ user_id: '', name, email })).rejects.toBeInstanceOf(AppError);
  });

  it(`should return an AppError instance if there is another user with the same email`, async () => {
    const anotherUser = await createUser.execute({
      name: 'Lucas Vieira',
      email: 'lkasvr@hotmail123.com',
      password: '34567'
    });
    const name = '';

    expect(updateProfile.execute({ user_id: user.id, name, email: anotherUser.email })).rejects.toBeInstanceOf(AppError);
  });

  it(`should return an AppError instance if not provide an old password to change the password`, async () => {
    const name = '', email = 'marcio456@outlook.com', password = '124';

    expect(updateProfile.execute({ user_id: user.id, name, email, password, old_password: '' })).rejects.toBeInstanceOf(AppError);
  });

  it(`Cover isTheSamePassword branch`, async () => {
    const name = 'Marcos', email = 'marcio456@outlook.com', password = '123456';

    expect(updateProfile.execute({ user_id: user.id, name, email, password, old_password: password })).rejects.toBeInstanceOf(AppError);
  });
});
