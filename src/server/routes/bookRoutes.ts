import express from 'express';
import * as bookController from '../controllers/bookController.js';
import { destructiveLimiter } from '../middlewares/securityMiddleware.js';

const router = express.Router();

router.get('/', bookController.getPaginatedBooks);
router.get('/:id', bookController.getBookById);
router.post('/', bookController.createBook);
router.patch('/:id', bookController.updateBook);
router.put('/:id', bookController.replaceBook);
router.delete('/:id', destructiveLimiter, bookController.deleteBook);

export default router;