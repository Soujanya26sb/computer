import dotenv from 'dotenv';
import path from 'path';

dotenv.config();

function required(name: string, fallback?: string): string {
  const value = process.env[name] ?? fallback;
  if (value === undefined) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

export const env = {
  nodeEnv: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.PORT || '5000', 10),
  clientUrl: process.env.CLIENT_URL || 'http://localhost:3000',

  databaseUrl: required('DATABASE_URL'),

  jwtSecret: required('JWT_SECRET'),
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',

  admin: {
    name: process.env.ADMIN_NAME || 'Shop Admin',
    phone: process.env.ADMIN_PHONE || '',
    email: process.env.ADMIN_EMAIL || '',
    whatsapp: process.env.ADMIN_WHATSAPP || '',
    shopName: process.env.SHOP_NAME || 'Computer Shop',
    shopAddress: process.env.SHOP_ADDRESS || '',
  },

  uploadDir: process.env.UPLOAD_DIR || 'uploads',
  maxImageSizeMb: parseInt(process.env.MAX_IMAGE_SIZE_MB || '5', 10),
  baseUrl: process.env.BASE_URL || 'http://localhost:5000',

  stock: {
    lowStockThreshold: parseInt(process.env.LOW_STOCK_THRESHOLD || '5', 10),
    outOfStockThreshold: parseInt(process.env.OUT_OF_STOCK_THRESHOLD || '0', 10),
  },

  initialAdmin: {
    name: process.env.INITIAL_ADMIN_NAME || 'Shop Admin',
    email: process.env.INITIAL_ADMIN_EMAIL || 'admin@computershop.com',
    password: process.env.INITIAL_ADMIN_PASSWORD || 'ChangeMe123!',
  },
};

export const uploadAbsolutePath = path.resolve(process.cwd(), env.uploadDir);
