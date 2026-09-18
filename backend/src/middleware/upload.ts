import fs from 'fs';
import multer from 'multer';
import path from 'path';
import { env, uploadAbsolutePath } from '../config/env';

const productsUploadPath = path.join(uploadAbsolutePath, 'products');

if (!fs.existsSync(productsUploadPath)) {
  fs.mkdirSync(productsUploadPath, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, productsUploadPath);
  },
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`;
    cb(null, uniqueName);
  },
});

const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];

function fileFilter(_req: any, file: Express.Multer.File, cb: multer.FileFilterCallback) {
  if (!allowedMimeTypes.includes(file.mimetype)) {
    return cb(new Error('Only image files (jpeg, png, webp, gif) are allowed'));
  }
  cb(null, true);
}

export const uploadProductImages = multer({
  storage,
  fileFilter,
  limits: { fileSize: env.maxImageSizeMb * 1024 * 1024 },
});
