import { Router, Request, Response } from 'express';

const router = Router();

type TrafficStatus = 'Fluxo Livre' | 'Lento' | 'Congestionado';

router.get('/', (req: Request, res: Response) => {
	const { latMin, latMax, lngMin, lngMax } = req.query;
	const a = Number(latMin ?? -90), b = Number(latMax ?? 90), c = Number(lngMin ?? -180), d = Number(lngMax ?? 180);
	const items = Array.from({ length: 10 }).map((_v, i) => ({
		id_trafego: `${i}`,
		status: (['Fluxo Livre', 'Lento', 'Congestionado'] as TrafficStatus[])[i % 3],
		area_geografica: { bbox: [a, c, b, d] },
		timestamp: new Date().toISOString(),
	}));
	res.json(items);
});

router.get('/realtime', (req: Request, res: Response) => {
	res.setHeader('Content-Type', 'text/event-stream');
	res.setHeader('Cache-Control', 'no-cache');
	res.setHeader('Connection', 'keep-alive');
	const interval = setInterval(() => {
		const payload = {
			timestamp: new Date().toISOString(),
			updates: Array.from({ length: 3 }).map((_v, i) => ({ id: i, status: ['Fluxo Livre', 'Lento', 'Congestionado'][Math.floor(Math.random() * 3)] })),
		};
		res.write(`data: ${JSON.stringify(payload)}\n\n`);
	}, 2000);
	req.on('close', () => {
		clearInterval(interval);
	});
});

export default router; 