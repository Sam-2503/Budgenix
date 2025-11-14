import { Router } from "express";
import { createExpense, deleteExpense, getExpenses } from "../controllers/expenses.controller.js";
import { verifyJwt } from "../middleware/verifyJwt.js";
const router = Router();

// Import expense controller functions
router.post("/create",verifyJwt, createExpense);
router.delete("/delete/:expenseId",verifyJwt,deleteExpense);
router.get("/get-expenses",verifyJwt,getExpenses);

export default router;