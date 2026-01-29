import { Router } from 'express';
import publicRoutes from './public.routes.js';
import privateRoutes from './private.routes.js';

const router = Router();

router.use('/public', publicRoutes);
router.use('/private', privateRoutes);

export default router;
