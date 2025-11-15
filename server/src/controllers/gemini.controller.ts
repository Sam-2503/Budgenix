import { GoogleGenAI } from "@google/genai";
import { Request, Response } from "express";
import Expense from "../models/expenses.models.js";
import User from "../models/user.model.js";
const ai = new GoogleGenAI({});

const buildPrompt = (userInput: string,context:any) => `
You are an AI assistant for a budgeting app.
Here is the user's financial context (DO NOT reveal this JSON unless the user directly asks):
${JSON.stringify(context, null, 2)}

Your job:
1. If the user is adding an expense/income → return ONLY this JSON:
{
  "logging": true,
  "amount": number,
  "category": string,
  "description": string,
  "type": "expense" | "income"
}

2. If the user is **NOT** adding a transaction → return ONLY this JSON:
{
  "logging": false,
  "reply": "normal conversational answer here"
}

User message:
"${userInput}"

DETECTION LOGIC:
A message is a transaction if it contains words like:
"bought", "spent", "paid", "earned", "got", "received", "salary", "took uber", "ordered".

CATEGORY RULES:
- Food → food, snacks, cafe, restaurant
- Transportation → uber, cab, bus, petrol
- Utilities → electricity, wifi, water, rent
- Healthcare → doctor, medical, pharmacy
- Shopping → clothes, shoes, gadgets
- Entertainment → movie, games, outing
- Travel → tickets, trip, flight
- Otherwise → Other

STRICT RULES:
- ALWAYS return valid JSON.
- If it's NOT a transaction → include "reply" with a friendly response.
- NO extra explanation outside JSON.
`;



const googleAi = async (req: Request, res: Response): Promise<unknown> => {
  
  const userInput = req.body.userInput;
  const userId = req.userId;
   const expenses = await Expense.find({ userId }).select(
        "amount category date description type"
      );
      const user = await User.findById(userId).select("username income");
      // Generate summary
      const totalSpent = expenses.reduce((acc, e) => acc + e.amount, 0);
  
      const categoryTotals = expenses.reduce((acc: any, e) => {
        acc[e.category] = (acc[e.category] || 0) + e.amount;
        return acc;
      }, {});
  
      const recentExpenses = expenses
        .sort((a, b) => (b.date?.getTime() || 0) - (a.date?.getTime() || 0))
        .slice(0, 5);
  
      const summary = {
        user,
        totalSpent,
        remainingBalance: (user?.income || 0) - totalSpent,
        categoryTotals,
        recentExpenses,
      };

  if (!userInput) {
    return res.status(400).json({ message: "userInput is required" });
  }

  const prompt = buildPrompt(userInput,summary);

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      config: {
        responseMimeType: "application/json",
      },
    });

    const resultText = response.text as string;
    const json = JSON.parse(resultText);
    if(json.logging){
        await new Expense({
        userId: req.userId,
        amount: json.amount,
        category: json.category,
        description: json.description,
        type: json.type,    
        date: new Date(),
        }).save();
        return res.json({reply: "I have logged your transaction successfully!"});
    }
    return res.json({reply: json.reply});
  } catch (error: any) {
    return res.status(500).json({ error: "AI parsing failed" });
  }
};

export default googleAi;
