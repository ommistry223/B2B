import express from 'express';
import {
  getAllPayments,
  getPaymentById,
  createPayment,
  getPaymentsByInvoice
} from '../controllers/payment.controller.js';
import { authMiddleware } from '../middleware/auth.middleware.js';

const router = express.Router();

// All payment routes require authentication
router.use(authMiddleware);

router.get('/', getAllPayments);
router.get('/:id', getPaymentById);
router.post('/', createPayment);
router.get('/invoice/:invoiceId', getPaymentsByInvoice);

export default router;
