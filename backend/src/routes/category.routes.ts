import { Router } from 'express';
import * as categoryController from '../controllers/category.controller';
import { authenticate, authorize } from '../middleware/auth';
import { validate } from '../middleware/validate';
import {
  createCategorySchema,
  idParamSchema,
  updateCategorySchema,
} from '../validation/category.validation';

const router = Router();

router.get('/', categoryController.list);
router.get('/:id', validate(idParamSchema), categoryController.getById);

router.post(
  '/',
  authenticate,
  authorize('ADMIN'),
  validate(createCategorySchema),
  categoryController.create
);

router.put(
  '/:id',
  authenticate,
  authorize('ADMIN'),
  validate(updateCategorySchema),
  categoryController.update
);

router.delete(
  '/:id',
  authenticate,
  authorize('ADMIN'),
  validate(idParamSchema),
  categoryController.remove
);

export default router;
