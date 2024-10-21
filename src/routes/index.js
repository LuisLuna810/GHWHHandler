const { Router } = require("express");
const router = Router();
const webhook_routes = require("./webhook.routes.js");
const pm2_routes = require("./pm2.routes.js");

router.use('/', webhook_routes)
router.use('/pm2', pm2_routes)