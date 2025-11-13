import { Request, Response } from 'express';
import { songsService } from '../services/songs.service';
import { validateCreateSong, validateUpdateSong } from '../models/song.model';

export class SongsController {
    async create(req: Request, res: Response): Promise<void> {
        try {
        const validation = validateCreateSong(req.body);
        
        if (!validation.valid) {
            res.status(400).json({
            success: false,
            message: 'Validation failed',
            errors: validation.errors
            });
            return;
        }

        const song = await songsService.create(req.body);
        
        res.status(201).json({
            success: true,
            data: song
        });
        } catch (error) {
        console.error('Error creating song:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
        }
    }

    async findAll(req: Request, res: Response): Promise<void> {
        try {
        const songs = await songsService.findAll();
        
        res.status(200).json({
            success: true,
            data: songs,
            count: songs.length
        });
        } catch (error) {
        console.error('Error fetching songs:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
        }
    }

    async findById(req: Request, res: Response): Promise<void> {
        try {
        const { id } = req.params;
        const song = await songsService.findById(id);

        if (!song) {
            res.status(404).json({
            success: false,
            message: 'Song not found'
            });
            return;
        }

        res.status(200).json({
            success: true,
            data: song
        });
        } catch (error) {
        console.error('Error fetching song:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
        }
    }

    async update(req: Request, res: Response): Promise<void> {
        try {
        const { id } = req.params;
        const validation = validateUpdateSong(req.body);

        if (!validation.valid) {
            res.status(400).json({
            success: false,
            message: 'Validation failed',
            errors: validation.errors
            });
            return;
        }

        const song = await songsService.update(id, req.body);

        if (!song) {
            res.status(404).json({
            success: false,
            message: 'Song not found'
            });
            return;
        }

        res.status(200).json({
            success: true,
            data: song
        });
        } catch (error) {
        console.error('Error updating song:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
        }
    }

    async delete(req: Request, res: Response): Promise<void> {
        try {
        const { id } = req.params;
        const deleted = await songsService.delete(id);

        if (!deleted) {
            res.status(404).json({
            success: false,
            message: 'Song not found'
            });
            return;
        }

        res.status(200).json({
            success: true,
            message: 'Song deleted successfully'
        });
        } catch (error) {
        console.error('Error deleting song:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
        }
    }
}

export const songsController = new SongsController();