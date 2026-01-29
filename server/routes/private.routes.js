import { Router } from 'express';
import usersRoutes from '../modules/users/users.routes.js';
import contactsRoutes from '../modules/contacts/contacts.routes.js';
import { protect } from '../middleware/auth.middleware.js';

const router = Router();

// Apply auth middleware to all private routes
router.use(protect);

router.use('/users', usersRoutes);
router.use('/contacts', contactsRoutes);

export default router;
