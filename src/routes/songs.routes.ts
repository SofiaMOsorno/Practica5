import { Router } from 'express';
import { songsController } from '../controllers/songs.controller';

const router = Router();
router.post('/', (req, res) => songsController.create(req, res));
router.get('/', (req, res) => songsController.findAll(req, res));
router.get('/:id', (req, res) => songsController.findById(req, res));
router.put('/:id', (req, res) => songsController.update(req, res));
router.delete('/:id', (req, res) => songsController.delete(req, res));

export default router;