import { db } from '../services/database.postgresql.js';
import { ApiError } from '../middleware/errorHandler.js';

export const getAllCustomers = async (req, res, next) => {
  try {
    const customers = await db.getCustomersByUserId(req.user.userId);
    res.json({ customers });
  } catch (error) {
    next(error);
  }
};

export const getCustomerById = async (req, res, next) => {
  try {
    const customer = await db.getCustomerById(req.params.id, req.user.userId);
    if (!customer) {
      throw new ApiError('Customer not found', 404);
    }
    res.json({ customer });
  } catch (error) {
    next(error);
  }
};

export const createCustomer = async (req, res, next) => {
  try {
    const { name, email, gst, phone, address, creditLimit, paymentTerms, riskScore } = req.body;

    if (!name) {
      throw new ApiError('Customer name is required', 400);
    }

    const customer = await db.createCustomer(req.user.userId, {
      name,
      email,
      gst,
      phone,
      address,
      creditLimit: creditLimit || 0,
      paymentTerms: paymentTerms || 30,
      riskScore: riskScore || 'low',
      outstanding: 0
    });

    res.status(201).json({
      message: 'Customer created successfully',
      customer
    });
  } catch (error) {
    next(error);
  }
};

export const updateCustomer = async (req, res, next) => {
  try {
    const { name, email, gst, phone, address, creditLimit, paymentTerms, riskScore } = req.body;

    const customer = await db.updateCustomer(req.params.id, req.user.userId, {
      name,
      email,
      gst,
      phone,
      address,
      creditLimit,
      paymentTerms,
      riskScore
    });

    if (!customer) {
      throw new ApiError('Customer not found', 404);
    }

    res.json({
      message: 'Customer updated successfully',
      customer
    });
  } catch (error) {
    next(error);
  }
};

export const deleteCustomer = async (req, res, next) => {
  try {
    const deleted = await db.deleteCustomer(req.params.id, req.user.userId);
    if (!deleted) {
      throw new ApiError('Customer not found', 404);
    }

    res.json({ message: 'Customer deleted successfully' });
  } catch (error) {
    next(error);
  }
};
