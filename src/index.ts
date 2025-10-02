import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import http from 'http';
import { Server as SocketIOServer } from 'socket.io';
import authRoutes from './modules/auth/auth.routes';
import usersRoutes from './modules/users/users.routes';
import incidentsRoutes from './modules/incidents/incidents.routes';
import routesRoutes from './modules/routes/routes.routes';
import trafficRoutes from './modules/traffic/traffic.routes';
import transportRoutes from './modules/transport/transport.routes';
import { errorHandler } from './middleware/error';

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new SocketIOServer(server, {
	cors: {
		origin: '*',
		methods: ['GET', 'POST']
	}
});

// Middlewares
app.use(cors());
app.use(express.json());

// Healthcheck
app.get('/health', (_req, res) => {
	res.json({ status: 'ok' });
});

// API base router
app.get('/', (_req, res) => {
	res.json({ name: 'Real-time Traffic Monitoring API', version: '1.0.0' });
});

// Modules
app.use('/api/auth', authRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/incidents', incidentsRoutes);
app.use('/api/routes', routesRoutes);
app.use('/api/traffic', trafficRoutes);
app.use('/api/transport', transportRoutes);

// Error handler
app.use(errorHandler);

// Socket.io basic connection
io.on('connection', (socket) => {
	console.log('Client connected', socket.id);
	socket.on('disconnect', () => {
		console.log('Client disconnected', socket.id);
	});
});

const PORT = process.env.PORT || 4000;
server.listen(PORT, () => {
	console.log(`Server running on http://localhost:${PORT}`);
}); 