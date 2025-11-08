import express from 'express'
import { login, logout, register } from '../controllers/auth.controller';

const router = express.Router();
router.post('/register',register as any);
router.post('/login',login as any);
router.post('/logout',logout as any)

export default router