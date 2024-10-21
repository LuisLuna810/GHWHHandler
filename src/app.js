const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const routes = require('./routes/index.js');

const { CORS_DOMAIN, DASHBOARD_DOMAIN } = process.env;
const server = express();

server.name = "BACK";

const whiteList = [CORS_DOMAIN, DASHBOARD_DOMAIN];

server.use(cors({ origin: whiteList, credentials: true }));
server.use(bodyParser.urlencoded({ extended: true, limit: "50mb" }));
server.use(bodyParser.json({ limit: "50mb" }));
server.use(morgan("dev"));

server.use("/", routes);

server.use((err, req, res, next) => {
  const status = err.status || 500;
  const message = err.message || err;
  console.error(err);
  res.status(status).send(message);
});

module.exports = server;
