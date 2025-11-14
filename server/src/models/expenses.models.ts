import mongoose, { Schema ,Document} from "mongoose";

export interface IExpense extends Document{
    userId: mongoose.ObjectId| string;
    amount: number;
    title: string;
    category: string;
    date?: Date;
    type?: string;
    description?: string;
    createdAt?: Date;
    updatedAt?: Date;
}

const ExpenseSchema = new Schema<IExpense>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    title: { type: String },
    amount: { type: Number, required: true },
    type: { type: String, enum: ["expense", "income"], default: "expense" },
    category: { type: String, required: true },
    date: { type: Date, required: true },
    description: { type: String },
  },
  { timestamps: true }
);

const Expense = mongoose.model<IExpense>("Expense", ExpenseSchema);
export default Expense; 