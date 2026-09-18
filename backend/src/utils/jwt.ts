import jwt from 'jsonwebtoken';
import { env } from '../config/env';

export type UserRole = 'ADMIN' | 'CUSTOMER';

export interface JwtPayload {
  userId: string;
  email: string;
  role: UserRole;
}

export function normalizeUserRole(role?: string): UserRole {
  const normalized = (role ?? 'CUSTOMER').toUpperCase();
  if (normalized === 'ADMIN' || normalized === 'OWNER') return 'ADMIN';
  return 'CUSTOMER';
}

export function signToken(payload: JwtPayload): string {
  return jwt.sign(payload, env.jwtSecret, { expiresIn: env.jwtExpiresIn as jwt.SignOptions['expiresIn'] });
}

export function verifyToken(token: string): JwtPayload {
  const payload = jwt.verify(token, env.jwtSecret) as JwtPayload;
  return { ...payload, role: normalizeUserRole(payload.role) };
}
