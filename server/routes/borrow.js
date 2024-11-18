import express from 'express';
import { borrow, status } from '../controllers/borrow.js';

const router = express.Router();

// you can add here new routes such as delete/patch
// dont forget create methods in controllers and then import 'em
router.post('/:id', borrow);
router.get('/status/:id', status);

export default router;