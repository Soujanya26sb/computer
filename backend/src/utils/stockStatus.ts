import { env } from '../config/env';

export type StockStatus = 'IN_STOCK' | 'LOW_STOCK' | 'OUT_OF_STOCK';

/**
 * Business rule (configurable via env vars LOW_STOCK_THRESHOLD / OUT_OF_STOCK_THRESHOLD):
 *  - stock_quantity > LOW_STOCK_THRESHOLD           -> IN_STOCK
 *  - OUT_OF_STOCK_THRESHOLD < stock_quantity <= LOW_STOCK_THRESHOLD -> LOW_STOCK
 *  - stock_quantity <= OUT_OF_STOCK_THRESHOLD       -> OUT_OF_STOCK
 */
export function getStockStatus(stockQuantity: number): StockStatus {
  const { lowStockThreshold, outOfStockThreshold } = env.stock;

  if (stockQuantity <= outOfStockThreshold) return 'OUT_OF_STOCK';
  if (stockQuantity <= lowStockThreshold) return 'LOW_STOCK';
  return 'IN_STOCK';
}
