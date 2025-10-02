import { NextFunction, Request, Response } from 'express';

export class HttpError extends Error {
	statusCode: number;
	constructor(statusCode: number, message: string) {
		super(message);
		this.statusCode = statusCode;
	}
}

export function errorHandler(err: unknown, _req: Request, res: Response, _next: NextFunction) {
	const isHttpError = err instanceof HttpError;
	const status = isHttpError ? err.statusCode : 500;
	const message = isHttpError ? err.message : 'Internal Server Error';
	res.status(status).json({ error: message });
} 