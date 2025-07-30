// src/domain/services/IS3Service.ts

export interface IS3Service {
  uploadFile(file: Express.Multer.File, key: string): Promise<string>;
  getPresignedUrl(key: string): Promise<string>;
  deleteFile(key: string): Promise<void>;
}
