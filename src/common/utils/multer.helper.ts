import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';

export interface FileField {
  name: string;
  maxCount: number;
}

export function createFileUploadInterceptor(
  fields: FileField[],
  destination: string,
  allowedMimeTypes: string[],
) {
  return FileFieldsInterceptor(fields, {
    fileFilter: (req, file, cb) => {
      if (allowedMimeTypes.includes(file.mimetype)) {
        cb(null, true);
      } else {
        cb(null, false);
      }
    },
    storage: diskStorage({
      destination,
      filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        const extension = file.originalname.split('.').pop();
        cb(null, `${file.fieldname}-${uniqueSuffix}.${extension}`);
      },
    }),
  });
}
