import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { HttpError } from './error';

export interface AuthUser {
	id: string;
	email: string;
	name: string;
}

declare global {
	namespace Express {
		interface Request {
			user?: AuthUser;
		}
	}
}

export function requireAuth(req: Request, _res: Response, next: NextFunction) {
	const authHeader = req.headers.authorization;
	if (!authHeader?.startsWith('Bearer ')) {
		return next(new HttpError(401, 'Missing or invalid Authorization header'));
	}
	const token = authHeader.slice(7);
	try {
		const secret = process.env.JWT_SECRET || 'dev-secret';
		const payload = jwt.verify(token, secret) as AuthUser & { iat: number; exp: number };
		req.user = { id: payload.id, email: payload.email, name: payload.name };
		return next();
	} catch (_e) {
		return next(new HttpError(401, 'Invalid token'));
	}
} 