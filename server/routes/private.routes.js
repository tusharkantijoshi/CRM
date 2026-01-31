import { Router } from "express";
import { protect } from "../middleware/auth.middleware.js";
import contactsRoutes from "../modules/contacts/contacts.routes.js";
import usersRoutes from "../modules/users/users.routes.js";

const router = Router();

// Apply auth middleware to all private routes
router.use(protect);

router.use("/users", usersRoutes);
router.use("/contacts", contactsRoutes);

export default router;
