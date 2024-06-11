const http = require('http');
const app = require('./src/app.js');

require('dotenv').config();

const { REPOSITORIOS } = process.env;
const port = process.env.PORT || 4000;

const httpServer = http.createServer(app);

httpServer.listen(port, () => {
  console.log(`Server listening at ${port}`);
})

// db.sync({ alter: true })
//   .then(() => {
//     console.log('Database synced successfully');

//   })
//   .catch((error) => {
//     console.error('Error syncing database:', error);
//   });
