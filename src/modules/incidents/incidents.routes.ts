import { Router, Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { requireAuth } from '../../middleware/auth';
import { HttpError } from '../../middleware/error';
import crypto from 'crypto';

const router = Router();

type IncidentType = 'Acidente' | 'Congestionamento' | 'Obra' | 'Via Bloqueada';

const createSchema = z.object({
	tipo_incidente: z.enum(['Acidente', 'Congestionamento', 'Obra', 'Via Bloqueada']),
	descricao: z.string().max(500).optional().default(''),
	latitude: z.number(),
	longitude: z.number(),
});

const incidents: Array<{ id: string; userId: string; tipo_incidente: IncidentType; descricao: string; latitude: number; longitude: number; timestamp: string }> = [];

router.post('/', requireAuth, (req: Request, res: Response, next: NextFunction) => {
	try {
		const { tipo_incidente, descricao, latitude, longitude } = createSchema.parse(req.body);
		const id = crypto.randomUUID();
		const incident = {
			id,
			userId: req.user!.id,
			tipo_incidente,
			descricao: descricao || '',
			latitude,
			longitude,
			timestamp: new Date().toISOString(),
		};
		incidents.push(incident);
		return res.status(201).json(incident);
	} catch (e) { next(e); }
});

router.get('/', (req: Request, res: Response) => {
	const { latMin, latMax, lngMin, lngMax } = req.query;
	let data = incidents;
	if (latMin && latMax && lngMin && lngMax) {
		const a = Number(latMin), b = Number(latMax), c = Number(lngMin), d = Number(lngMax);
		data = data.filter((i) => i.latitude >= a && i.latitude <= b && i.longitude >= c && i.longitude <= d);
	}
	return res.json(data);
});

router.get('/:id', (req: Request, res: Response, next: NextFunction) => {
	const item = incidents.find((i) => i.id === req.params.id);
	if (!item) return next(new HttpError(404, 'Incidente não encontrado'));
	return res.json(item);
});

router.delete('/:id', requireAuth, (req: Request, res: Response, next: NextFunction) => {
	const idx = incidents.findIndex((i) => i.id === req.params.id);
	if (idx < 0) return next(new HttpError(404, 'Incidente não encontrado'));
	if (incidents[idx].userId !== req.user!.id) return next(new HttpError(403, 'Apenas o autor pode remover'));
	incidents.splice(idx, 1);
	return res.status(204).send();
});

export default router; 