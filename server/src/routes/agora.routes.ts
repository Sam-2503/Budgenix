import { Router } from "express";
const route = Router();
import { aiCallback, startAI, stopAI } from "../controllers/agora.controller.js";
import { verifyJwt } from "../middleware/verifyJwt.js";

route.post("/start-ai",verifyJwt, startAI);
route.post("/stop-ai",verifyJwt, stopAI);


export default route;
