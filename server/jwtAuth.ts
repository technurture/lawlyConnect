import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import { storage } from './storage';

export interface JWTPayload {
  userId: string;
  email: string;
  userType: 'client' | 'lawyer' | 'admin';
  firstName?: string;
  lastName?: string;
  iat?: number;
  exp?: number;
}

export interface JWTTokenPair {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

// JWT configuration
const JWT_ACCESS_SECRET = process.env.JWT_ACCESS_SECRET || process.env.SESSION_SECRET;
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || (process.env.SESSION_SECRET + '_refresh');
const ACCESS_TOKEN_EXPIRES_IN = '15m'; // 15 minutes
const REFRESH_TOKEN_EXPIRES_IN = '7d'; // 7 days

if (!JWT_ACCESS_SECRET) {
  throw new Error('JWT_ACCESS_SECRET or SESSION_SECRET must be provided');
}

/**
 * Generate access token
 */
export function generateAccessToken(payload: Omit<JWTPayload, 'iat' | 'exp'>): string {
  return jwt.sign(payload, JWT_ACCESS_SECRET!, {
    expiresIn: ACCESS_TOKEN_EXPIRES_IN,
    issuer: 'legal-marketplace',
    audience: 'legal-marketplace-users'
  });
}

/**
 * Generate refresh token
 */
export function generateRefreshToken(payload: Omit<JWTPayload, 'iat' | 'exp'>): string {
  return jwt.sign(payload, JWT_REFRESH_SECRET!, {
    expiresIn: REFRESH_TOKEN_EXPIRES_IN,
    issuer: 'legal-marketplace',
    audience: 'legal-marketplace-users'
  });
}

/**
 * Generate both access and refresh tokens
 */
export function generateTokenPair(payload: Omit<JWTPayload, 'iat' | 'exp'>): JWTTokenPair {
  const accessToken = generateAccessToken(payload);
  const refreshToken = generateRefreshToken(payload);
  
  return {
    accessToken,
    refreshToken,
    expiresIn: 15 * 60 // 15 minutes in seconds
  };
}

/**
 * Verify access token
 */
export function verifyAccessToken(token: string): JWTPayload {
  try {
    return jwt.verify(token, JWT_ACCESS_SECRET!, {
      issuer: 'legal-marketplace',
      audience: 'legal-marketplace-users'
    }) as JWTPayload;
  } catch (error) {
    throw new Error('Invalid access token');
  }
}

/**
 * Verify refresh token
 */
export function verifyRefreshToken(token: string): JWTPayload {
  try {
    return jwt.verify(token, JWT_REFRESH_SECRET!, {
      issuer: 'legal-marketplace',
      audience: 'legal-marketplace-users'
    }) as JWTPayload;
  } catch (error) {
    throw new Error('Invalid refresh token');
  }
}

/**
 * Extract token from Authorization header
 */
function extractTokenFromHeader(authHeader: string | undefined): string | null {
  if (!authHeader) return null;
  
  const parts = authHeader.split(' ');
  if (parts.length !== 2 || parts[0] !== 'Bearer') return null;
  
  return parts[1];
}

/**
 * JWT Authentication middleware
 */
export const jwtAuthenticated = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = extractTokenFromHeader(req.headers.authorization);
    
    if (!token) {
      return res.status(401).json({ 
        message: 'Access token required',
        code: 'NO_TOKEN'
      });
    }

    const payload = verifyAccessToken(token);
    
    // Verify user still exists in database
    const user = await storage.getUser(payload.userId);
    if (!user) {
      return res.status(401).json({ 
        message: 'User not found',
        code: 'USER_NOT_FOUND'
      });
    }

    // Attach user info to request
    (req as any).jwtUser = {
      ...payload,
      user
    };

    next();
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      return res.status(401).json({ 
        message: 'Token expired',
        code: 'TOKEN_EXPIRED'
      });
    } else if (error instanceof jwt.JsonWebTokenError) {
      return res.status(401).json({ 
        message: 'Invalid token',
        code: 'INVALID_TOKEN'
      });
    } else {
      return res.status(401).json({ 
        message: 'Authentication failed',
        code: 'AUTH_FAILED'
      });
    }
  }
};

/**
 * JWT Authentication middleware that allows both JWT and session auth
 */
export const flexibleAuth = async (req: Request, res: Response, next: NextFunction) => {
  const token = extractTokenFromHeader(req.headers.authorization);
  
  if (token) {
    // Try JWT authentication first
    try {
      const payload = verifyAccessToken(token);
      const user = await storage.getUser(payload.userId);
      
      if (user) {
        (req as any).jwtUser = {
          ...payload,
          user
        };
        (req as any).authType = 'jwt';
        return next();
      }
    } catch (error) {
      // JWT failed, fall through to session auth
    }
  }
  
  // Fall back to session authentication
  if (req.isAuthenticated && req.isAuthenticated() && (req as any).user) {
    (req as any).authType = 'session';
    return next();
  }
  
  return res.status(401).json({ 
    message: 'Authentication required',
    code: 'AUTH_REQUIRED'
  });
};

/**
 * Get user from request (works with both JWT and session auth)
 */
export function getAuthenticatedUser(req: Request): { userId: string; userType: string; user?: any } | null {
  const jwtUser = (req as any).jwtUser;
  const sessionUser = (req as any).user;
  
  if (jwtUser) {
    return {
      userId: jwtUser.userId,
      userType: jwtUser.userType,
      user: jwtUser.user
    };
  }
  
  if (sessionUser && sessionUser.claims) {
    return {
      userId: sessionUser.claims.sub,
      userType: sessionUser.userType || 'client',
      user: sessionUser
    };
  }
  
  return null;
}

/**
 * Role-based authorization middleware
 */
export function requireRole(roles: string | string[]) {
  const roleArray = Array.isArray(roles) ? roles : [roles];
  
  return (req: Request, res: Response, next: NextFunction) => {
    const authUser = getAuthenticatedUser(req);
    
    if (!authUser || !roleArray.includes(authUser.userType)) {
      return res.status(403).json({ 
        message: 'Insufficient permissions',
        code: 'INSUFFICIENT_PERMISSIONS',
        requiredRoles: roleArray
      });
    }
    
    next();
  };
}