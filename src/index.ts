import express from 'express';
import { config } from './config/environment';
import songsRoutes from './routes/songs.routes';
import { notFoundHandler, errorHandler } from './middlewares/errorHandler';

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/health', (req, res) => {
    res.status(200).json({
        status: 'OK',
        environment: config.nodeEnv,
        timestamp: new Date().toISOString(),
        table: config.database.tableName
    });
});

app.get('/', (req, res) => {
    res.json({
        message: 'Songs API - Práctica 5 CI/CD',
        endpoints: {
        health: '/health',
        songs: {
            getAll: 'GET /api/songs',
            getById: 'GET /api/songs/:id',
            create: 'POST /api/songs',
            update: 'PUT /api/songs/:id',
            delete: 'DELETE /api/songs/:id'
        }
        },
        environment: process.env.NODE_ENV,
        version: '1.0.0'
    });
});

app.use('/api/songs', songsRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

if (process.env.NODE_ENV !== 'test') {
    app.listen(config.port, () => {
        console.log(`Server running on port ${config.port}`);
        console.log(`Environment: ${config.nodeEnv}`);
        console.log(`Health check: http://localhost:${config.port}/health`);
        console.log(`Songs API: http://localhost:${config.port}/api/songs`);
    });
}

export default app;