import { Router } from 'express';
import * as orderController from '../controllers/order.controller';
import { authenticate, authorize } from '../middleware/auth';
import { validate } from '../middleware/validate';
import { createOrderSchema, listOrdersQuerySchema, updateOrderStatusSchema } from '../validation/order.validation';

const router = Router();

router.post('/', validate(createOrderSchema), orderController.create);
router.get('/', authenticate, authorize('ADMIN'), validate(listOrdersQuerySchema), orderController.list);
router.get('/stats', authenticate, authorize('ADMIN'), orderController.stats);
router.patch('/:id/status', authenticate, authorize('ADMIN'), validate(updateOrderStatusSchema), orderController.updateStatus);

export default router;
