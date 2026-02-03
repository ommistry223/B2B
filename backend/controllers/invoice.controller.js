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

    // Recalculate customer outstanding for accuracy
    await db.recalculateCustomerOutstanding(customerId, req.user.userId);

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
    const allowedFields = [
      'invoiceNumber',
      'customerId',
      'customerName',
      'amount',
      'dueDate',
      'items',
      'notes',
      'status',
      'paidAmount'
    ];

    const updates = Object.keys(req.body || {}).reduce((acc, key) => {
      if (allowedFields.includes(key) && req.body[key] !== undefined) {
        acc[key] = req.body[key];
      }
      return acc;
    }, {});

    if (Object.keys(updates).length === 0) {
      throw new ApiError('No valid fields to update', 400);
    }

    // Get the old invoice to calculate outstanding change
    const oldInvoice = await db.getInvoiceById(req.params.id, req.user.userId);
    if (!oldInvoice) {
      throw new ApiError('Invoice not found', 404);
    }

    // If customerId changes, ensure customer exists and backfill name when missing
    const nextCustomerId = updates.customerId || oldInvoice.customerId;
    if (updates.customerId) {
      const nextCustomer = await db.getCustomerById(
        updates.customerId,
        req.user.userId
      );
      if (!nextCustomer) {
        throw new ApiError('Customer not found', 404);
      }
      if (!updates.customerName) {
        updates.customerName = nextCustomer.name;
      }
    }

    const invoice = await db.updateInvoice(
      req.params.id,
      req.user.userId,
      updates
    );

    // Recalculate outstanding for affected customers
    if (nextCustomerId !== oldInvoice.customerId) {
      await db.recalculateCustomerOutstanding(
        oldInvoice.customerId,
        req.user.userId
      );
    }
    await db.recalculateCustomerOutstanding(nextCustomerId, req.user.userId);

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

    const deleted = await db.deleteInvoice(req.params.id, req.user.userId);
    if (!deleted) {
      throw new ApiError('Invoice not found', 404);
    }

    // Recalculate customer outstanding after deletion
    await db.recalculateCustomerOutstanding(
      invoice.customerId,
      req.user.userId
    );

    res.json({ message: 'Invoice deleted successfully' });
  } catch (error) {
    next(error);
  }
};
