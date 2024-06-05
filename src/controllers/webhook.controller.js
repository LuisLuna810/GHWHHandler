require("dotenv").config({ path: "./.env" });
const { REPOSITORIOS } = process.env;
const fs = require('fs');
const simpleGit = require('simple-git');


async function webHookHandler(req, res) {
  const repoName = req.body.repository.name;
  console.log(repoName);
  const localRepoPath = `${REPOSITORIOS}/${repoName}`;
  if (!fs.existsSync(localRepoPath)) {
    console.log(`Repository ${repoName} not found.`);
    return res.status(404).send('Repository not found');
  }
  simpleGit(localRepoPath)
    .pull()
    .then(() => {
      console.log(`Repository ${repoName} has been updated.`);
      //reiniciar aplicación con PM2
       
       
      res.status(200).send('Updated successfully');
    })
    .catch((err) => {
      console.error('Error updating repository:', err);
      res.status(500).send('Internal Server Error');
    });
};



module.exports = {
  webHookHandler,
};
