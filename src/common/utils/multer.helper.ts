import { BadRequestException } from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';

export interface FileField {
  name: string;
  maxCount: number;
}

export function createFileUploadInterceptor(
  fields: FileField[],

  allowedMimeTypes: string[],
) {
  return FileFieldsInterceptor(fields, {
    limits: {
      fileSize: 5 * 1024 * 1024,
    },
    fileFilter: (req, file, cb) => {
      if (allowedMimeTypes.includes(file.mimetype)) {
        cb(null, true);
      } else {
        cb(
          new BadRequestException(
            `File type not supported; supported types : ${allowedMimeTypes.join('|')}`,
          ),
          false,
        );
      }
    },
    storage: diskStorage({
      filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        const extension = file.originalname.split('.').pop();
        cb(null, `${file.fieldname}-${uniqueSuffix}.${extension}`);
      },
    }),
  });
}
