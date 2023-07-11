// App
import { inject, injectable } from 'tsyringe';
import AppError from '@shared/errors/AppError';
import { IUpdateUserAvatar } from '../domain/models/IUpdateUserAvatar';
import { IUser } from '../domain/models/IUser';
import { IUsersRepository } from '../domain/repositories/IUsersRepository';
import StorageProvider from '@shared/providers/StorageProvider/implementations/StorageProvider';

@injectable()
class UpdateUserAvatarService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,
  ) { }

  public async execute({
    user_id,
    avatarFilename,
  }: IUpdateUserAvatar): Promise<IUser> {
    const user = await this.usersRepository.findById(user_id);

    if (!user) throw new AppError('User not found.');

    const storageProvider = new StorageProvider();
    const filename = await storageProvider.execute({ avatarFilename, filename: user.avatar })


    user.avatar = filename;
    await this.usersRepository.save(user);
    return user;
  }
}

export default UpdateUserAvatarService;
