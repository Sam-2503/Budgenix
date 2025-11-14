import Expense, { IExpense } from "../models/expenses.models.js";
import { Request, Response } from "express";
import mongoose from "mongoose";

// Create expense controller
export const createExpense = async (
  req: Request,
  res: Response
): Promise<unknown> => {
  try {
    const { userId, amount, category,date, description } = req.body as Partial<IExpense>;
    if(!userId || !amount || !category){
      return res.status(400).json({ message: "Missing required fields" });
    }
    const newExpense = new Expense({
      userId,
      amount,
      category,
      date:date||new Date(),
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