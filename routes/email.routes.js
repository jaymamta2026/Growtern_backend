import express from "express";
import {
  sendLeadEmailController,
} from "../controllers/email.controller.js";

const router = express.Router();

router.post(
  "/send-lead-email",
  sendLeadEmailController
);

export default router;