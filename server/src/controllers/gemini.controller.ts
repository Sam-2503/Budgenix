import { GoogleGenAI } from "@google/genai";
import { Request, Response } from "express";
import Expense from "../models/expenses.models.js";
const ai = new GoogleGenAI({});

const buildPrompt = (userInput: string) => `
You are an AI assistant for a budgeting app.

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

  if (!userInput) {
    return res.status(400).json({ message: "userInput is required" });
  }

  const prompt = buildPrompt(userInput);

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
