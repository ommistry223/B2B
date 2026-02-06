import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import { db } from '../services/database.postgresql.js';
import { ApiError } from '../middleware/errorHandler.js';

const getBackendBaseUrl = (req) => {
  const forwardedProto = req.get('x-forwarded-proto');
  const forwardedHost = req.get('x-forwarded-host');
  if (forwardedProto || forwardedHost) {
    const protocol = forwardedProto ? forwardedProto.split(',')[0].trim() : req.protocol;
    const host = forwardedHost ? forwardedHost.split(',')[0].trim() : req.get('host');
    return `${protocol}://${host}`;
  }
  if (process.env.BACKEND_URL) return process.env.BACKEND_URL;
  return `${req.protocol}://${req.get('host')}`;
};

const getFrontendUrlCandidates = () => {
  const values = [];
  if (process.env.FRONTEND_URL) values.push(process.env.FRONTEND_URL);
  if (process.env.FRONTEND_URLS) {
    process.env.FRONTEND_URLS
      .split(',')
      .map(value => value.trim())
      .filter(Boolean)
      .forEach(value => values.push(value));
  }
  return [...new Set(values)];
};

const getFrontendBaseUrl = () => {
  const candidates = getFrontendUrlCandidates();
  if (candidates.length > 0) return candidates[0];
  return 'http://localhost:4028';
};

const isAbsoluteUrl = (value) => /^https?:\/\//i.test(String(value || ''));

const isAllowedRedirect = (urlString) => {
  try {
    const url = new URL(urlString);
    const allowedBases = getFrontendUrlCandidates();
    if (allowedBases.length > 0) {
      return allowedBases.some(base => new URL(base).host === url.host);
    }
    return (
      url.host.endsWith('.netlify.app') ||
      url.host === 'localhost:4028' ||
      url.host === 'localhost:5173'
    );
  } catch {
    return false;
  }
};

export const register = async (req, res, next) => {
  try {
    const { email, password, fullName, businessName, phone } = req.body;

    // Validation
    if (!email || !password) {
      throw new ApiError('Email and password are required', 400);
    }

    // Check if user already exists
    const existingUser = await db.findUserByEmail(email);
    if (existingUser) {
      throw new ApiError('User already exists', 409);
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await db.createUser({
      email,
      password: hashedPassword,
      fullName,
      businessName,
      phone
    });

    // Generate token
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    // Return user without password
    const { password: _, ...userWithoutPassword } = user;

    res.status(201).json({
      message: 'User registered successfully',
      user: userWithoutPassword,
      token
    });
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      throw new ApiError('Email and password are required', 400);
    }

    // Find user
    const user = await db.findUserByEmail(email);
    if (!user) {
      throw new ApiError('Invalid credentials', 401);
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new ApiError('Invalid credentials', 401);
    }

    // Generate token
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    // Return user without password
    const { password: _, ...userWithoutPassword } = user;

    res.json({
      message: 'Login successful',
      user: userWithoutPassword,
      token
    });
  } catch (error) {
    next(error);
  }
};

export const getProfile = async (req, res, next) => {
  try {
    const user = await db.findUserById(req.user.userId);
    if (!user) {
      throw new ApiError('User not found', 404);
    }

    const { password: _, ...userWithoutPassword } = user;
    res.json({ user: userWithoutPassword });
  } catch (error) {
    next(error);
  }
};

export const updateProfile = async (req, res, next) => {
  try {
    const { fullName, businessName, phone } = req.body;

    const user = await db.findUserById(req.user.userId);
    if (!user) {
      throw new ApiError('User not found', 404);
    }

    const updatedUser = await db.updateUser(req.user.userId, {
      fullName,
      businessName,
      phone
    });

    const { password: _, ...userWithoutPassword } = updatedUser;
    res.json({
      message: 'Profile updated successfully',
      user: userWithoutPassword
    });
  } catch (error) {
    next(error);
  }
};

export const changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      throw new ApiError('Current password and new password are required', 400);
    }

    const user = await db.findUserById(req.user.userId);
    if (!user) {
      throw new ApiError('User not found', 404);
    }

    // Verify current password
    const isPasswordValid = await bcrypt.compare(currentPassword, user.password);
    if (!isPasswordValid) {
      throw new ApiError('Current password is incorrect', 401);
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await db.updateUser(req.user.userId, { password: hashedPassword });

    res.json({ message: 'Password changed successfully' });
  } catch (error) {
    next(error);
  }
};

export const googleAuthRedirect = async (req, res, next) => {
  try {
    const clientId = process.env.GOOGLE_CLIENT_ID;
    if (!clientId) {
      throw new ApiError('Google OAuth is not configured', 500);
    }

    const redirectUri = `${getBackendBaseUrl(req)}/api/auth/google/callback`;
    const requestedRedirect = req.query.redirect || '';
    const state = requestedRedirect
      ? Buffer.from(requestedRedirect, 'utf8').toString('base64')
      : '';

    const params = new URLSearchParams({
      client_id: clientId,
      redirect_uri: redirectUri,
      response_type: 'code',
      scope: 'openid email profile',
      access_type: 'offline',
      prompt: 'consent',
    });

    if (state) {
      params.append('state', state);
    }

    const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
    res.redirect(authUrl);
  } catch (error) {
    next(error);
  }
};

export const googleAuthCallback = async (req, res, next) => {
  try {
    const { code, state } = req.query;

    if (!code) {
      throw new ApiError('Authorization code is missing', 400);
    }

    const clientId = process.env.GOOGLE_CLIENT_ID;
    const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
    if (!clientId || !clientSecret) {
      throw new ApiError('Google OAuth is not configured', 500);
    }

    const redirectUri = `${getBackendBaseUrl(req)}/api/auth/google/callback`;

    const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        code: String(code),
        client_id: clientId,
        client_secret: clientSecret,
        redirect_uri: redirectUri,
        grant_type: 'authorization_code',
      }),
    });

    if (!tokenResponse.ok) {
      const tokenError = await tokenResponse.text();
      throw new ApiError(`Google token exchange failed: ${tokenError}`, 401);
    }

    const tokenData = await tokenResponse.json();
    const accessToken = tokenData.access_token;

    if (!accessToken) {
      throw new ApiError('Google access token missing', 401);
    }

    const profileResponse = await fetch(
      'https://www.googleapis.com/oauth2/v2/userinfo',
      {
        headers: { Authorization: `Bearer ${accessToken}` },
      }
    );

    if (!profileResponse.ok) {
      const profileError = await profileResponse.text();
      throw new ApiError(`Google profile fetch failed: ${profileError}`, 401);
    }

    const profile = await profileResponse.json();

    if (!profile?.email) {
      throw new ApiError('Google profile email missing', 400);
    }

    let user = await db.findUserByEmail(profile.email);

    if (!user) {
      const randomPassword = crypto.randomBytes(32).toString('hex');
      const hashedPassword = await bcrypt.hash(randomPassword, 10);
      user = await db.createUser({
        email: profile.email,
        password: hashedPassword,
        fullName: profile.name || null,
        businessName: null,
        phone: null,
      });
    }

    const token = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    const frontendBase = getFrontendBaseUrl();
    const decodedState = state
      ? Buffer.from(String(state), 'base64').toString('utf8')
      : '';
    const redirectTarget = decodedState || '/auth/google/callback';
    const redirectUrl = isAbsoluteUrl(redirectTarget) && isAllowedRedirect(redirectTarget)
      ? new URL(redirectTarget)
      : new URL(redirectTarget, frontendBase);
    redirectUrl.searchParams.set('token', token);

    res.redirect(redirectUrl.toString());
  } catch (error) {
    next(error);
  }
};
