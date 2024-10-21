import express from 'express';
import { listProcesses, getProcessStatus, checkProcessHealth } from '../controllers/pm2.controller.js';


const router = express.Router();

// Ruta para listar todos los procesos de PM2
router.get('/processes', listProcesses);

// Ruta para obtener el estado de un proceso específico por nombre
router.get('/process/:name', getProcessStatus);

// Ruta para verificar la salud de un proceso específico
router.get('/process/:name/health', checkProcessHealth);

export default router;
