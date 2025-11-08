import express from 'express';
import { authMiddleware } from '../middelware/auth.middelware';
import { getProfile, getUsers } from '../controllers/user.controler';

const router = express.Router();


router.get('/', authMiddleware as any, getUsers as any);
router.get('/me', authMiddleware as any, getProfile as any);

export default router;
