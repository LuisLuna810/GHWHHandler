import { Router } from "express";
import webhook_routes from "./webhook.routes.js";
import pm2_routes from "./pm2.routes.js";

const router = Router();

router.use('/', webhook_routes);
router.use('/pm2', pm2_routes);

export default router;