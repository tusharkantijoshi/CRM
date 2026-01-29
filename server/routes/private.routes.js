import { Router } from 'express';
import usersRoutes from '../modules/users/users.routes.js';
import productsRoutes from '../modules/products/products.routes.js';

const router = Router();

router.use('/users', usersRoutes);
router.use('/products', productsRoutes);

export default router;
