import { db } from '../services/database.postgresql.js';
import { ApiError } from '../middleware/errorHandler.js';

export const getAllPayments = async (req, res, next) => {
  try {
    const payments = await db.getPaymentsByUserId(req.user.userId);
    res.json({ payments });
  } catch (error) {
    next(error);
  }
};

export const getPaymentById = async (req, res, next) => {
  try {
    const payment = await db.getPaymentById(req.params.id, req.user.userId);
    if (!payment) {
      throw new ApiError('Payment not found', 404);
    }
    res.json({ payment });
  } catch (error) {
    next(error);
  }
};

export const createPayment = async (req, res, next) => {
  try {
    const {
      invoiceId,
      amount,
      paymentDate,
      paymentMethod,
      reference,
      notes
    } = req.body;

    if (!invoiceId || !amount || !paymentDate) {
      throw new ApiError('Invoice, amount, and payment date are required', 400);
    }

    // Get invoice
    const invoice = await db.getInvoiceById(invoiceId, req.user.userId);
    if (!invoice) {
      throw new ApiError('Invoice not found', 404);
    }

    const payment = await db.createPayment(req.user.userId, {
      invoiceId,
      invoiceNumber: invoice.invoiceNumber,
      customerId: invoice.customerId,
      customerName: invoice.customerName,
      amount,
      paymentDate,
      paymentMethod: paymentMethod || 'bank_transfer',
      reference,
      notes
    });

    // Update invoice paid amount and status
    const newPaidAmount = (invoice.paidAmount || 0) + parseFloat(amount);
    const invoiceTotal = parseFloat(invoice.amount);
    let newStatus = 'partial';

    if (newPaidAmount >= invoiceTotal) {
      newStatus = 'paid';
    } else if (newPaidAmount > 0) {
      newStatus = 'partial';
    }

    await db.updateInvoice(invoiceId, req.user.userId, {
      paidAmount: newPaidAmount,
      status: newStatus
    });

    // Update customer outstanding
    const customer = await db.getCustomerById(invoice.customerId, req.user.userId);
    if (customer) {
      await db.updateCustomer(invoice.customerId, req.user.userId, {
        outstanding: Math.max(0, (customer.outstanding || 0) - parseFloat(amount))
      });
    }

    res.status(201).json({
      message: 'Payment recorded successfully',
      payment
    });
  } catch (error) {
    next(error);
  }
};

export const getPaymentsByInvoice = async (req, res, next) => {
  try {
    const payments = await db.getPaymentsByInvoiceId(req.params.invoiceId, req.user.userId);
    res.json({ payments });
  } catch (error) {
    next(error);
  }
};
