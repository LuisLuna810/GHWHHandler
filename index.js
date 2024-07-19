const http = require('http');
const app = require('./src/app.js');

require('dotenv').config();

const port = process.env.PORT || 4000;

const httpServer = http.createServer(app);

httpServer.listen(port, () => {
  console.log(`Server listening at ${port}`);
})
