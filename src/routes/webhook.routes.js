import { Router } from "express";
import {webHookHandler} from '../controllers/webhook.controller.js';

const router = Router();

router.post("/webhook", webHookHandler);

export default router;
