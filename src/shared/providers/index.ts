import { container } from 'tsyringe';
import DiskStorageProvider from './StorageProvider/implementations/DiskStorageProvider';
import S3StorageProvider from './StorageProvider/implementations/S3StorageProvider';
import { IDiskStorageProvider, IS3StorageProvider } from './StorageProvider/models/IStorageProviders';

container.registerSingleton<IDiskStorageProvider>('StorageProvider', DiskStorageProvider);
container.registerSingleton<IS3StorageProvider>('StorageProvider', S3StorageProvider);
