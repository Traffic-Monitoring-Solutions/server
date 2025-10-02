import { Router, Request, Response, NextFunction } from 'express';
import { z } from 'zod';

const router = Router();

const nearbySchema = z.object({ latitude: z.coerce.number(), longitude: z.coerce.number(), radius: z.coerce.number().default(1000) });

router.get('/stops', (req: Request, res: Response, next: NextFunction) => {
	try {
		const { latitude, longitude, radius } = nearbySchema.parse(req.query);
		const stops = Array.from({ length: 5 }).map((_v, i) => ({ id: `${i}`, name: `Parada ${i}`, latitude: latitude + i * 0.001, longitude: longitude + i * 0.001 }));
		return res.json({ radius, stops });
	} catch (e) { next(e); }
});

router.get('/stops/:id/arrivals', (req: Request, res: Response) => {
	const arrivals = [
		{ line: '101', etaMinutes: 3 },
		{ line: '220', etaMinutes: 8 },
		{ line: '550', etaMinutes: 14 },
	];
	return res.json({ stopId: req.params.id, arrivals });
});

router.get('/lines', (_req: Request, res: Response) => {
	return res.json([
		{ id: '101', name: 'Centro - Bairro' },
		{ id: '220', name: 'Terminal - Shopping' },
		{ id: '550', name: 'Circular Universitário' },
	]);
});

export default router; 