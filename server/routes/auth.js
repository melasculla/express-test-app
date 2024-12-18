import express from 'express';
import { register, login } from '../controllers/auth.js';

const router = express.Router();

// you can add here new routes such as delete/patch
// dont forget create methods in controllers and then import 'em
router.post('/register', register);
router.post('/login', login);

export default router;