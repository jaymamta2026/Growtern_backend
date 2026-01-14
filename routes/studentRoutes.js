import express from 'express';
import { saveStudent } from '../controllers/studentController.js';

const router = express.Router();

// POST /api/students
router.post('/', saveStudent);

export default router;
