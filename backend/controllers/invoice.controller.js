import { db } from '../services/database.postgresql.js';
import { ApiError } from '../middleware/errorHandler.js';

export const getAllInvoices = async (req, res, next) => {
  try {
    const invoices = await db.getInvoicesByUserId(req.user.userId);
    res.json({ invoices });
  } catch (error) {
    next(error);
  }
};

export const getInvoiceById = async (req, res, next) => {
  try {
    const invoice = await db.getInvoiceById(req.params.id, req.user.userId);
    if (!invoice) {
      throw new ApiError('Invoice not found', 404);
    }
    res.json({ invoice });
  } catch (error) {
    next(error);
  }
};

export const createInvoice = async (req, res, next) => {
  try {
    const {
      invoiceNumber,
      customerId,
      customerName,
      amount,
      dueDate,
      items,
      notes,
      status
    } = req.body;

    if (!invoiceNumber || !customerId || !amount || !dueDate) {
      throw new ApiError('Invoice number, customer, amount, and due date are required', 400);
    }

    const invoice = await db.createInvoice(req.user.userId, {
      invoiceNumber,
      customerId,
      customerName,
      amount,
      dueDate,
      items: items || [],
      notes,
      status: status || 'pending',
      paidAmount: 0
    });

    // Update customer outstanding
    const customer = await db.getCustomerById(customerId, req.user.userId);
    if (customer) {
      await db.updateCustomer(customerId, req.user.userId, {
        outstanding: (customer.outstanding || 0) + parseFloat(amount)
      });
    }

    res.status(201).json({
      message: 'Invoice created successfully',
      invoice
    });
  } catch (error) {
    next(error);
  }
};

export const updateInvoice = async (req, res, next) => {
  try {
    const updates = req.body;
    const invoice = await db.updateInvoice(req.params.id, req.user.userId, updates);

    if (!invoice) {
      throw new ApiError('Invoice not found', 404);
    }

    res.json({
      message: 'Invoice updated successfully',
      invoice
    });
  } catch (error) {
    next(error);
  }
};

export const deleteInvoice = async (req, res, next) => {
  try {
    const invoice = await db.getInvoiceById(req.params.id, req.user.userId);
    if (!invoice) {
      throw new ApiError('Invoice not found', 404);
    }

    // Update customer outstanding
    const customer = await db.getCustomerById(invoice.customerId, req.user.userId);
    if (customer) {
      await db.updateCustomer(invoice.customerId, req.user.userId, {
        outstanding: Math.max(0, (customer.outstanding || 0) - parseFloat(invoice.amount))
      });
    }

    const deleted = await db.deleteInvoice(req.params.id, req.user.userId);
    if (!deleted) {
      throw new ApiError('Invoice not found', 404);
    }

    res.json({ message: 'Invoice deleted successfully' });
  } catch (error) {
    next(error);
  }
};
