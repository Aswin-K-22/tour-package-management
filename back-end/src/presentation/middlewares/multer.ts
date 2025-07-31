// backend/src/presentation/middlware/multer.ts
import { Request } from 'express';
import multer from 'multer';
import { ERRORMESSAGES } from '@/domain/constants/errorMessages.constant';

const fileFilter = (req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  const allowedTypes = ['image/jpeg', 'image/png'];
  if (!allowedTypes.includes(file.mimetype)) {
    return cb(new Error(ERRORMESSAGES.INVALID_IMAGE_TYPE));
  }
  if (file.size > 20 * 1024 * 1024) {
    return cb(new Error(ERRORMESSAGES.IMAGE_SIZE_EXCEEDED));
  }
  cb(null, true);
};

export const upload = multer({
  storage: multer.memoryStorage(),
  fileFilter,
  limits: { fileSize: 20 * 1024 * 1024 }, // 20
});