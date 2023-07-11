import DiskStorageProvider from '../implementations/DiskStorageProvider';
import S3StorageProvider from '../implementations/S3StorageProvider';
import { IStorageProvider } from '../models/IStorageProvider';
import { IS3StorageProvider, IDiskStorageProvider } from '../models/IStorageProviders';

class StorageProvider {

  private s3StorageProvider: IS3StorageProvider = new S3StorageProvider();
  private diskStorageProvider: IDiskStorageProvider = new DiskStorageProvider();

  public async execute({ filename, avatarFilename, driver }: IStorageProvider): Promise<string> {
    if (driver === 's3') {
      if (filename) {
        await this.s3StorageProvider.deleteFile(filename);
      }
      return await this.s3StorageProvider.saveFile(avatarFilename);
    } else {
      if (filename) {
        await this.diskStorageProvider.deleteFile(filename);
      }
      return await this.diskStorageProvider.saveFile(avatarFilename);
    }
  }
}

export default StorageProvider;
