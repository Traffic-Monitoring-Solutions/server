import { Router, Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { requireAuth } from '../../middleware/auth';
import { _debug_getUsers } from '../auth/auth.controller';
import { HttpError } from '../../middleware/error';

const router = Router();

const updateSchema = z.object({ name: z.string().min(2).optional() });
const locationSchema = z.object({ latitude: z.number(), longitude: z.number() });

router.get('/:id', requireAuth, (req: Request, res: Response, next: NextFunction) => {
	try {
		const users = _debug_getUsers();
		const user = users.find((u) => u.id === req.params.id);
		if (!user) throw new HttpError(404, 'Usuário não encontrado');
		return res.json({ id: user.id, name: user.name, email: user.email });
	} catch (e) { next(e); }
});

router.put('/:id', requireAuth, (req: Request, res: Response, next: NextFunction) => {
	try {
		const users = _debug_getUsers();
		const user = users.find((u) => u.id === req.params.id);
		if (!user) throw new HttpError(404, 'Usuário não encontrado');
		const body = updateSchema.parse(req.body);
		if (body.name) user.name = body.name;
		return res.json({ id: user.id, name: user.name, email: user.email });
	} catch (e) { next(e); }
});

router.put('/:id/location', requireAuth, (req: Request, res: Response, next: NextFunction) => {
	try {
		const _ = locationSchema.parse(req.body);
		// Simulação: em um banco real, persistiríamos a localização
		return res.json({ ok: true });
	} catch (e) { next(e); }
});

export default router; 