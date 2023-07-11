import { container } from 'tsyringe';
import DiskStorageProvider from './StorageProvider/implementations/DiskStorageProvider';
import S3StorageProvider from './StorageProvider/implementations/S3StorageProvider';
import { IProvider } from './StorageProvider/models/IProviders';

container.registerSingleton<IProvider>('DiskStorageProvider', DiskStorageProvider);
container.registerSingleton<IProvider>('S3StorageProvider', S3StorageProvider);
