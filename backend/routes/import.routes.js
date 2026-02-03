import express from 'express';
import multer from 'multer';
import { importTallyXml } from '../controllers/import.controller.js';
import { authMiddleware } from '../middleware/auth.middleware.js';

const router = express.Router();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024,
  },
});

router.post('/tally', authMiddleware, upload.single('file'), importTallyXml);

export default router;
