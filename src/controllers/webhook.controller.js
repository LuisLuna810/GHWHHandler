import dotenv from 'dotenv';
dotenv.config({ path: './.env' });
import fs from 'fs';
import path from 'path';
import simpleGit from 'simple-git';
import { exec } from 'child_process';

const { REPOSITORIOS } = process.env;


async function webHookHandler(req, res) {
  const repoName = req.body.repository.name;
  const localRepoPath = path.join(REPOSITORIOS, repoName);

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
        exec('npm install', { cwd: localRepoPath }, async (error, stdout, stderr) => {
          if (error) {
            console.error(`Error installing dependencies: ${error.message}`);
            return res.status(500).send('Error installing dependencies');
          }
          console.log(`Dependencies updated:\n${stdout}`);
          console.error(`npm install stderr:\n${stderr}`);

          // Verificación antes de hacer reload
          exec('npm run build', { cwd: localRepoPath }, async (buildError, buildStdout, buildStderr) => {
            if (buildError) {
              console.error(`Build failed: ${buildError.message}`);
              return res.status(500).send('Build failed');
            }
            console.log(`Build completed:\n${buildStdout}`);
            console.error(`Build stderr:\n${buildStderr}`);

            // Si todo va bien, hacer reload con PM2 para zero downtime
            exec(`pm2 reload ${repoName}`, async (pm2Error, pm2Stdout, pm2Stderr) => {
              if (pm2Error) {
                console.error(`PM2 reload failed: ${pm2Error.message}`);
                return res.status(500).send('PM2 reload failed');
              }
              console.log(`PM2 reloaded successfully:\n${pm2Stdout}`);
              console.error(`PM2 stderr:\n${pm2Stderr}`);
              
              res.status(200).send('Updated, built, and reloaded successfully');
            });
          });
        });
      } else {
        // Si package.json no cambió, solo recargar PM2
        exec(`pm2 reload ${repoName}`, async (pm2Error, pm2Stdout, pm2Stderr) => {
          if (pm2Error) {
            console.error(`PM2 reload failed: ${pm2Error.message}`);
            return res.status(500).send('PM2 reload failed');
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
    res.status(500).send('Internal Server Error');
  }
}

export {
  webHookHandler,
};
