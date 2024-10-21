const express = require('express');
const router = express.Router();
const pm2Controller = require('../controllers/pm2.controller');

// Ruta para listar todos los procesos de PM2
router.get('/pm2/processes', pm2Controller.listProcesses);

// Ruta para obtener el estado de un proceso específico por nombre
router.get('/pm2/process/:name', pm2Controller.getProcessStatus);

// Ruta para verificar la salud de un proceso específico
router.get('/pm2/process/:name/health', pm2Controller.checkProcessHealth);

module.exports = router;
