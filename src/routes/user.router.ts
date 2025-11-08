import express from 'express'
import { authMiddleware } from '../middelware/auth.middelware';
import { getProfile, getUsers } from '../controllers/user.controler';


const router = express.Router();
router.post('/',authMiddleware as any, getUsers as any);
router.post('/me',authMiddleware as any ,getProfile as any);

export default router