import { Router } from 'express';
import usersRoutes from '../modules/users/users.routes.js';
import productsRoutes from '../modules/products/products.routes.js';
import { protect } from '../middleware/auth.middleware.js';

const router = Router();

// Apply auth middleware to all private routes
router.use(protect);

router.use('/users', usersRoutes);
router.use('/products', productsRoutes);

export default router;
