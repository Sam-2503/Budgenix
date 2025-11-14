import Expense, { IExpense } from "../models/expenses.models.js";
import { Request, Response } from "express";
import mongoose from "mongoose";

// Create expense controller
export const createExpense = async (
  req: Request,
  res: Response
): Promise<unknown> => {
  try {
    const userId = req.userId;
    const { amount, category, date, description, type } =
      req.body as Partial<IExpense>;
    if (!userId || !amount || !category || !type) {
      return res.status(400).json({ message: "Missing required fields" });
    }
    const newExpense = new Expense({
      userId,
      amount,
      category,
      type,
      date: date || new Date(),
      description,
    });
    await newExpense.save();
    return res
      .status(201)
      .json({ message: "Expense created successfully", newExpense });
  } catch (error) {
    return res.status(500).json({ message: "Server error", error });
  }
};

// Delete expense controller
export const deleteExpense = async (req: Request, res: Response) => {
  try {
    const userId = req.userId;
    const { expenseId } = req.params;
    if (!userId) return res.status(400).json({ message: "Missing user id" });
    if (!expenseId || !mongoose.Types.ObjectId.isValid(expenseId)) {
      return res.status(400).json({ message: "Invalid expense id" });
    }
    const expense = await Expense.findByIdAndDelete(expenseId);
    if (!expense) {
      return res.status(404).json({ message: "Expense not found" });
    }
    return res
      .status(200)
      .json({ message: "Expense deleted successfully", expense });
  } catch (error) {
    return res.status(500).json({ message: "Server error", error });
  }
};
