require('dotenv').config({ path: './.env' });
const { REPOSITORIOS } = process.env;
const fs = require('fs');
const path = require('path');
const simpleGit = require('simple-git');
const { exec } = require('child_process');

async function webHookHandler(req, res) {
  const repoName = req.body.repository.name;
  console.log(repoName);
  const localRepoPath = path.join(REPOSITORIOS, repoName);
  const pm2AppName = repoName; // Asume que el nombre del app en PM2 es el mismo que el del repo

  if (!fs.existsSync(localRepoPath)) {
    console.log(`Repository ${repoName} not found.`);
    return res.status(404).send('Repository not found');
  }

  const git = simpleGit(localRepoPath);
  const packageJsonPath = path.join(localRepoPath, 'package.json');
  const tempPackageJsonPath = path.join(localRepoPath, 'package.temp.json');

  try {
    // Backup del package.json antes de actualizar
    if (fs.existsSync(packageJsonPath)) {
      fs.copyFileSync(packageJsonPath, tempPackageJsonPath);
    }

    // Actualizar el repositorio
    await git.pull();
    console.log(`Repository ${repoName} has been updated.`);

    // Si package.json cambió, ejecutar npm install
    if (fs.existsSync(packageJsonPath) && fs.existsSync(tempPackageJsonPath)) {
      const oldPackageJson = fs.readFileSync(tempPackageJsonPath, 'utf8');
      const newPackageJson = fs.readFileSync(packageJsonPath, 'utf8');

      if (oldPackageJson !== newPackageJson) {
        console.log('package.json has changed. Updating dependencies...');
        exec('npm install', { cwd: localRepoPath }, (error, stdout, stderr) => {
          if (error) {
            console.error(`Error installing dependencies: ${error.message}`);
            return rollback(res, pm2AppName, 'Error installing dependencies');
          }
          console.log(`Dependencies updated:\n${stdout}`);
          console.error(`npm install stderr:\n${stderr}`);

          // Verificación antes de hacer reload
          exec('npm run build', { cwd: localRepoPath }, (buildError, buildStdout, buildStderr) => {
            if (buildError) {
              console.error(`Build failed: ${buildError.message}`);
              return rollback(res, pm2AppName, 'Build failed');
            }
            console.log(`Build completed:\n${buildStdout}`);
            console.error(`Build stderr:\n${buildStderr}`);

            // Si todo va bien, hacer reload con PM2 para zero downtime
            exec(`pm2 reload ${pm2AppName}`, (pm2Error, pm2Stdout, pm2Stderr) => {
              if (pm2Error) {
                console.error(`PM2 reload failed: ${pm2Error.message}`);
                return rollback(res, pm2AppName, 'PM2 reload failed');
              }
              console.log(`PM2 reloaded successfully:\n${pm2Stdout}`);
              console.error(`PM2 stderr:\n${pm2Stderr}`);
              res.status(200).send('Updated, built and reloaded successfully');
            });
          });
        });
      } else {
        // Si package.json no cambió, solo recargar PM2
        exec(`pm2 reload ${pm2AppName}`, (pm2Error, pm2Stdout, pm2Stderr) => {
          if (pm2Error) {
            console.error(`PM2 reload failed: ${pm2Error.message}`);
            return rollback(res, pm2AppName, 'PM2 reload failed');
          }
          console.log(`PM2 reloaded successfully:\n${pm2Stdout}`);
          console.error(`PM2 stderr:\n${pm2Stderr}`);
          res.status(200).send('Updated and reloaded successfully');
        });
      }
      fs.unlinkSync(tempPackageJsonPath);
    } else {
      res.status(200).send('Updated successfully');
    }
  } catch (err) {
    console.error('Error updating repository:', err);
    return rollback(res, pm2AppName, 'Internal Server Error');
  }
}

// Función de rollback en caso de fallo
function rollback(res, pm2AppName, message) {
  console.log(`Rolling back ${pm2AppName}...`);
  exec(`pm2 restart ${pm2AppName}`, (pm2Error, pm2Stdout, pm2Stderr) => {
    if (pm2Error) {
      console.error(`Rollback failed: ${pm2Error.message}`);
      return res.status(500).send('Rollback failed');
    }
    console.log(`Rollback successful:\n${pm2Stdout}`);
    console.error(`PM2 stderr:\n${pm2Stderr}`);
    res.status(500).send(message);
  });
}

module.exports = {
  webHookHandler,
};
