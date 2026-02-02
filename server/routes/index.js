import { Router } from "express";
import privateRoutes from "./private.routes.js";
import publicRoutes from "./public.routes.js";

const router = Router();

router.use("/", publicRoutes);
router.use("/", privateRoutes);

export default router;
