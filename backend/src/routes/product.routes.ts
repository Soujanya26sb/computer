import { Router } from 'express';
import * as productController from '../controllers/product.controller';
import { authenticate, authorize } from '../middleware/auth';
import { uploadProductImages } from '../middleware/upload';
import { validate } from '../middleware/validate';
import { idParamSchema } from '../validation/category.validation';
import {
  createProductSchema,
  listProductsQuerySchema,
  updateProductSchema,
} from '../validation/product.validation';

const router = Router();

// Public read endpoints
router.get('/', validate(listProductsQuerySchema), productController.list);
router.get('/stats', authenticate, authorize('ADMIN'), productController.getStats);
router.get('/slug/:slug', productController.getBySlug);
router.get('/:id', validate(idParamSchema), productController.getById);

// Protected write endpoints (admin only)
router.post(
  '/',
  authenticate,
  authorize('ADMIN'),
  uploadProductImages.array('images', 10),
  validate(createProductSchema),
  productController.create
);

router.put(
  '/:id',
  authenticate,
  authorize('ADMIN'),
  uploadProductImages.array('images', 10),
  validate(updateProductSchema),
  productController.update
);

router.delete(
  '/:id',
  authenticate,
  authorize('ADMIN'),
  validate(idParamSchema),
  productController.remove
);

export default router;
