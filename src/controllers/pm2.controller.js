import pm2 from 'pm2';

// Función para listar los procesos de PM2
function listProcesses(req, res) {
  pm2.connect((err) => {
    if (err) {
      console.error('Error connecting to PM2:', err);
      return res.status(500).send('Error connecting to PM2');
    }

    pm2.list((err, list) => {
      pm2.disconnect(); // Desconectar de PM2 después de listar los procesos
      if (err) {
        console.error('Error listing PM2 processes:', err);
        return res.status(500).send('Error listing PM2 processes');
      }

      res.status(200).json(list);
    });
  });
}

// Función para obtener el estado de un proceso específico
function getProcessStatus(req, res) {
  const appName = req.params.name; // Nombre de la aplicación

  pm2.connect((err) => {
    if (err) {
      console.error('Error connecting to PM2:', err);
      return res.status(500).send('Error connecting to PM2');
    }

    pm2.describe(appName, (err, processDescription) => {
      pm2.disconnect();
      if (err) {
        console.error(`Error fetching status of ${appName}:`, err);
        return res.status(500).send(`Error fetching status of ${appName}`);
      }

      if (processDescription.length === 0) {
        return res.status(404).send(`Process ${appName} not found`);
      }

      res.status(200).json(processDescription[0]);
    });
  });
}

// Función para verificar si un proceso está corriendo correctamente
function checkProcessHealth(req, res) {
  const appName = req.params.name;

  pm2.connect((err) => {
    if (err) {
      console.error('Error connecting to PM2:', err);
      return res.status(500).send('Error connecting to PM2');
    }

    pm2.describe(appName, (err, processDescription) => {
      pm2.disconnect();
      if (err) {
        console.error(`Error fetching status of ${appName}:`, err);
        return res.status(500).send(`Error fetching status of ${appName}`);
      }

      if (processDescription.length === 0) {
        return res.status(404).send(`Process ${appName} not found`);
      }

      const processInfo = processDescription[0];

      // Verificar si el proceso está corriendo correctamente
      if (processInfo.pm2_env.status === 'online') {
        return res.status(200).send(`Process ${appName} is running correctly`);
      } else {
        return res.status(200).send(`Process ${appName} has issues: ${processInfo.pm2_env.status}`);
      }
    });
  });
}

export {
  listProcesses,
  getProcessStatus,
  checkProcessHealth,
};
