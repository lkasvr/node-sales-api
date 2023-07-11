

export default class FakeS3StorageProvider {
  private file: string;

  public async saveFile(file: string): Promise<string> {
    this.file = file;
    return file;
  }

  public async deleteFile(file: string): Promise<void> {
    if (this.file === file) this.file = '';
  }
}
