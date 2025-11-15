import { Router } from "express";
import googleAi from "../controllers/gemini.controller.js";
import { verifyJwt } from "../middleware/verifyJwt.js";
const route = Router();

route.post("/generateai",verifyJwt, googleAi);

export default route;   