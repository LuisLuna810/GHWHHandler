import http from 'http';
import app from './src/app.js';
import dotenv from 'dotenv';

dotenv.config();

const port = process.env.PORT || 4000;

const httpServer = http.createServer(app);

httpServer.listen(port, () => {
  console.log(`Server listening at ${port}`);
});
