import { NextFunction, Request, Response } from 'express';
import { ApiError } from '../utils/ApiError';
import { normalizeUserRole, UserRole, verifyToken } from '../utils/jwt';

export function authenticate(req: Request, _res: Response, next: NextFunction) {
  const header = req.headers.authorization;

  if (!header || !header.startsWith('Bearer ')) {
    return next(ApiError.unauthorized('Authentication token missing'));
  }

  const token = header.split(' ')[1];

  try {
    const payload = verifyToken(token);
    req.user = { ...payload, role: normalizeUserRole(payload.role) };
    next();
  } catch (err) {
    next(ApiError.unauthorized('Invalid or expired token'));
  }
}

export function authorize(...roles: UserRole[]) {
  return (req: Request, _res: Response, next: NextFunction) => {
    if (!req.user) {
      return next(ApiError.unauthorized('Authentication required'));
    }

    const normalizedRole = normalizeUserRole(req.user.role);
    if (!roles.includes(normalizedRole)) {
      return next(ApiError.forbidden('You do not have permission to perform this action'));
    }

    req.user.role = normalizedRole;
    next();
  };
}
