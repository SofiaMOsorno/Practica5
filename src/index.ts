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

app.use('/api/songs', songsRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

app.listen(config.port, () => {
    console.log(`Server running on port ${config.port}`);
    console.log(`Environment: ${config.nodeEnv}`);
    console.log(`Health check: http://localhost:${config.port}/health`);
    console.log(`Songs API: http://localhost:${config.port}/api/songs`);
});