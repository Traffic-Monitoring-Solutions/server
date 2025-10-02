import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { HttpError } from '../../middleware/error';
import crypto from 'crypto';

const users: Array<{ id: string; name: string; email: string; passwordHash: string }> = [];

const registerSchema = z.object({
	name: z.string().min(2),
	email: z.string().email(),
	password: z.string().min(6),
});

const loginSchema = z.object({
	email: z.string().email(),
	password: z.string().min(6),
});

export async function register(req: Request, res: Response, next: NextFunction) {
	try {
		const { name, email, password } = registerSchema.parse(req.body);
		const exists = users.find((u) => u.email.toLowerCase() === email.toLowerCase());
		if (exists) throw new HttpError(409, 'Email já cadastrado');
		const passwordHash = await bcrypt.hash(password, 10);
		const id = crypto.randomUUID();
		const user = { id, name, email, passwordHash };
		users.push(user);
		const token = signToken({ id, email, name });
		return res.status(201).json({ token, user: { id, name, email } });
	} catch (err) {
		return next(err);
	}
}

export async function login(req: Request, res: Response, next: NextFunction) {
	try {
		const { email, password } = loginSchema.parse(req.body);
		const user = users.find((u) => u.email.toLowerCase() === email.toLowerCase());
		if (!user) throw new HttpError(401, 'Credenciais inválidas');
		const ok = await bcrypt.compare(password, user.passwordHash);
		if (!ok) throw new HttpError(401, 'Credenciais inválidas');
		const token = signToken({ id: user.id, email: user.email, name: user.name });
		return res.json({ token, user: { id: user.id, name: user.name, email: user.email } });
	} catch (err) {
		return next(err);
	}
}

function signToken(payload: { id: string; email: string; name: string }) {
	const secret = process.env.JWT_SECRET || 'dev-secret';
	return jwt.sign(payload, secret, { expiresIn: '7d' });
}

export function _debug_getUsers() {
	return users;
} 