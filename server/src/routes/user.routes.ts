import { Router } from "express";
import { getUserProfile, loginUser, registerUser } from "../controllers/user.controller.js";
import { verify } from "crypto";
import { verifyJwt } from "../middleware/verifyJwt.js";
const router = Router();

// Import user controller functions
router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/profile", verifyJwt,getUserProfile);

export default router;