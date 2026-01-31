import { Router } from "express";
import {
  createContact,
  deleteContact,
  getContactActivity,
  getContacts,
  updateContact,
} from "./contacts.controller.js";

const router = Router();

router.get("/", getContacts);
router.post("/", createContact);
router.get("/:id/activity", getContactActivity);
router.put("/:id", updateContact);
router.delete("/:id", deleteContact);

export default router;
