import { Router, Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import crypto from 'crypto';

const router = Router();

const calculateSchema = z.object({
	origem: z.string().min(2),
	destino: z.string().min(2),
	pontos_intermediarios: z.array(z.string()).optional().default([]),
});

type RouteItem = { id: string; origem: string; destino: string; pontos_intermediarios: string[]; tempo_estimado: number; distancia: number };
const routes: RouteItem[] = [];

router.post('/calculate', (req: Request, res: Response, next: NextFunction) => {
	try {
		const { origem, destino, pontos_intermediarios } = calculateSchema.parse(req.body);
		const id = crypto.randomUUID();
		const distancia = Math.round(Math.random() * 30 + 5); // km
		const tempo_estimado = Math.round(distancia * 2); // min
		const route: RouteItem = { id, origem, destino, pontos_intermediarios, distancia, tempo_estimado };
		routes.push(route);
		return res.status(201).json(route);
	} catch (e) { next(e); }
});

router.get('/:id', (req: Request, res: Response, next: NextFunction) => {
	const route = routes.find((r) => r.id === req.params.id);
	if (!route) return next(new Error('Rota não encontrada'));
	return res.json(route);
});

export default router; 