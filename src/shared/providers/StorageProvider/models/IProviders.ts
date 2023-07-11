export interface IProvider {
  saveFile(file: string): Promise<string>;
  deleteFile(file: string): Promise<void>;
}
