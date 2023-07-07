import { v4 as uuidv4 } from 'uuid';
import { ICreateUser } from '@modules/users/domain/models/ICreateUser';
import { IUsersRepository } from '@modules/users/domain/repositories/IUsersRepository';
import User from '@modules/users/infra/typeorm/entities/User';

class FakeUsersRepository implements IUsersRepository {
  private users: User[] = [
    {
      id: '5678',
      avatar: '',
      name: '',
      email: '',
      password: '',
      created_at: new Date(),
      updated_at: new Date(),
      getAvatarUrl: () => null,
    }
  ];

  public async create({ name, email, password }: ICreateUser): Promise<User> {
    const user = new User();

    user.id = uuidv4();
    user.name = name;
    user.email = email;
    user.password = password;

    this.users.push(user);

    return user;
  }

  public async save(user: User): Promise<User> {
    const findIndex = this.users.findIndex(findUser => findUser.id === user.id);

    this.users[findIndex] = user;

    return user;
  }

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  public async remove(user: User): Promise<void> { }

  public async findAll(): Promise<User[]> {
    let i = 1;
    while (i <= 10) {
      this.create({
        name: `Marcos Vieira ${i}`,
        email: `marcimo${i}@hotmail.com`,
        password: `123456-${i}`,
      });
      i++;
    }

    return this.users;
  }

  public async findByName(name: string): Promise<User | undefined> {
    const user = this.users.find(user => user.name === name);
    return user;
  }

  public async findById(id: string): Promise<User | undefined> {
    const user = this.users.find(user => user.id === id);
    return user;
  }

  public async findByEmail(email: string): Promise<User | undefined> {
    const user = this.users.find(user => user.email === email);
    return user;
  }
}

export default FakeUsersRepository;
