// App
import { inject, injectable } from 'tsyringe';
import AppError from '@shared/errors/AppError';
import { IUpdateUserAvatar } from '../domain/models/IUpdateUserAvatar';
import { IUser } from '../domain/models/IUser';
import { IUsersRepository } from '../domain/repositories/IUsersRepository';
import upload from '@config/upload';
import { IProvider } from '@shared/providers/StorageProvider/models/IProviders';
import StorageProvider from '@shared/providers/StorageProvider/implementations/StorageProvider';

@injectable()
class UpdateUserAvatarService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,
    @inject('S3StorageProvider')
    private s3StorageProvider: IProvider,
    @inject('DiskStorageProvider')
    private diskStorageProvider: IProvider,
  ) { }

  public async execute({
    user_id,
    avatarFilename,
  }: IUpdateUserAvatar): Promise<IUser> {
    const user = await this.usersRepository.findById(user_id);

    if (!user) throw new AppError('User not found.');

    let filename: string;

    if (upload.driver === 's3') {
      const storageProvider = new StorageProvider(this.s3StorageProvider);
      filename = await storageProvider.execute({ avatarFilename, filename: user.avatar })
    } else {
      const storageProvider = new StorageProvider(this.diskStorageProvider);
      filename = await storageProvider.execute({ avatarFilename, filename: user.avatar })
    }

    user.avatar = filename;
    await this.usersRepository.save(user);
    return user;
  }
}

export default UpdateUserAvatarService;
