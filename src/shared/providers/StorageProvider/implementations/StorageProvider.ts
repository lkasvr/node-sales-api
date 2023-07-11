import { IStorageProvider } from '../models/IStorageProvider';
import { IProvider } from '../models/IProviders';

class StorageProvider {
  constructor(
    private storageProvider: IProvider,
  ) { }

  public async execute({ filename, avatarFilename }: IStorageProvider): Promise<string> {
    if (filename) {
      await this.storageProvider.deleteFile(filename);
    }
    return await this.storageProvider.saveFile(avatarFilename);
  }
}

export default StorageProvider;
