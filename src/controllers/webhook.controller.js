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

  if (!fs.existsSync(localRepoPath)) {
    console.log(`Repository ${repoName} not found.`);
    return res.status(404).send('Repository not found');
  }

  const git = simpleGit(localRepoPath);
  const packageJsonPath = path.join(localRepoPath, 'package.json');
  const tempPackageJsonPath = path.join(localRepoPath, 'package.temp.json');

  try {
    if (fs.existsSync(packageJsonPath)) {
      fs.copyFileSync(packageJsonPath, tempPackageJsonPath);
    }

    await git.pull();
    console.log(`Repository ${repoName} has been updated.`);

    if (fs.existsSync(packageJsonPath) && fs.existsSync(tempPackageJsonPath)) {
      const oldPackageJson = fs.readFileSync(tempPackageJsonPath, 'utf8');
      const newPackageJson = fs.readFileSync(packageJsonPath, 'utf8');

      if (oldPackageJson !== newPackageJson) {
        console.log('package.json has changed. Updating dependencies...');
        exec('npm install', { cwd: localRepoPath }, (error, stdout, stderr) => {
          if (error) {
            console.error(`Error installing dependencies: ${error.message}`);
            return res.status(500).send('Error installing dependencies');
          }
          console.log(`Dependencies updated:\n${stdout}`);
          console.error(`npm install stderr:\n${stderr}`);
          res.status(200).send('Updated and dependencies installed successfully');
        });
      } else {
        res.status(200).send('Updated successfully');
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

module.exports = {
  webHookHandler,
};
