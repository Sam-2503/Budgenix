import { Types } from "mongoose";

// Extend Express Request interface to include userId
declare global {
  namespace Express {
    interface Request {
      userId?: string | Types.ObjectId;
      expenseId?: string | Types.ObjectId;  
    }
  }
}

export {};
