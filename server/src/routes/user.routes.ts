import { Router } from "express";
import { loginUser, registerUser } from "../controllers/user.controller.js";
const router = Router();

// Import user controller functions
router.post("/register", registerUser);
router.post("/login", loginUser);

export default router;