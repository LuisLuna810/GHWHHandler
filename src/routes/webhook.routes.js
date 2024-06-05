const { Router } = require("express");
const router = Router();
const webHookController = require("../controllers/webhook.controller");

router.post("/webhook", webHookController.webHookHandler);


module.exports = router;
