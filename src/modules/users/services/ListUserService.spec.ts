import 'reflect-metadata';
import FakeUsersRepository from '../domain/repositories/fakes/FakeUsersRepository';
import ListUserService from './ListUserService';

let fakeUsersRepository: FakeUsersRepository;
let listUser: ListUserService;

describe('ListUser', () => {
  beforeEach(async () => {
    fakeUsersRepository = new FakeUsersRepository();

    listUser = new ListUserService(fakeUsersRepository);
  });

  it(`should list all user's`, async () => {
    const users = await listUser.execute();

    expect(users).toEqual(expect.arrayContaining([
      ...users
    ]));
  });
});
