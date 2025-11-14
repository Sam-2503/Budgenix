import { Router } from "express";
import { createExpense, deleteExpense } from "../controllers/expenses.controller.js";
import { verifyJwt } from "../middleware/verifyJwt.js";
const router = Router();

// Import expense controller functions
router.post("/create",verifyJwt, createExpense);
router.delete("/delete/:expenseId",verifyJwt,deleteExpense);

export default router;