import express from "express";

import {
  registerAdmin,
  loginAdmin,
  logoutAdmin,
  getCurrentAdmin,
} from "../controllers/auth.controller.js";

import { protectAdmin } from "../middleware/admin.middleware.js";

const router = express.Router();


// Login -  Public Routes
router.post("/login", loginAdmin);

// Protected Routes
// Register New Admin (Only Logged-in Admin can create another admin)
router.post("/register", protectAdmin, registerAdmin);

// Get Logged-in Admin
router.get("/me", protectAdmin, getCurrentAdmin);

// Logout
router.post("/logout", protectAdmin, logoutAdmin);

export default router;