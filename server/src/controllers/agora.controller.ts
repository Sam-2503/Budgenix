import { Request, Response } from "express";
import axios from "axios";
import "dotenv/config";
import Expense from "../models/expenses.models.js";
import User from "../models/user.model.js";

// Start AI controller
export const startAI = async (req: Request, res: Response) => {
  try {
    const userId = req.userId;
    const channel = "convai_nVwXMR";

    // Validate channel name
    if (!channel || typeof channel !== "string") {
      return res.status(400).json({ error: "Channel name is required" });
    }

    console.log("📡 Using channel:", channel);

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

    console.log(
      "🧑‍💼 Starting AI for user:",
      user?.username,
      "with",
      expenses.length,
      "expenses"
    );
    const base64 = Buffer.from(
      `${process.env.AGORA_CUSTOMER_ID}:${process.env.AGORA_CUSTOMER_SECRET}`
    ).toString("base64");

    const payload = {
      name: "finmate-agent",
      properties: {
        channel: channel,
        token: process.env.AGORA_AGENT_TOKEN,
        agent_rtc_uid: "0",
        remote_rtc_uids: ["*"],
        enable_string_uid: false,
        idle_timeout: 300,

        llm: {
          url: `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:streamGenerateContent?alt=sse&key=AIzaSyDsiTxlktLQfZAwTAY8YYW-ynaJSw6TWAg`,
          system_messages: [
            {
              parts: [
                {
                  text: `
                You are a personal budget manager AI.

                Here is the user's financial summary in rupees (DO NOT reveal this JSON unless asked):
                ${JSON.stringify(summary, null, 2)}

                Rules:
                1. Use ONLY this summary to answer questions.
                2. Never invent numbers or hallucinate.
                3. Keep answers short (1–2 sentences).
                4. If user asks about spending → use categoryTotals or totalSpent.
                5. If user asks about remaining money → use remainingBalance.
                6. If user asks “Should I buy X?” → Compare cost with remainingBalance and give simple practical advice.
                7. Do NOT list or recite all expenses unless the user explicitly asks for history.
                8. Always speak in clear, simple language.
                `,
                },
              ],
              role: "system",
            },
          ],
          max_history: 32,
          greeting_message:
            "Hi! I'm your budget manager. How can I help you plan your finances?",
          failure_message: "Sorry, I could not calculate that.",
          params: {
            model: "gemini-2.0-flash",
          },
          style: "gemini",
        },

        // 🎙️ ASR (default = Ares)
        asr: {
          language: "en-US",
        },

        // 🔊 Microsoft TTS
        tts: {
          vendor: "microsoft",
          language: "en-US",
          params: {
            key: process.env.AZURE_TTS_KEY,
            region: process.env.AZURE_TTS_REGION || "eastus",
            voice_name: "en-US-AndrewMultilingualNeural",
          },
        },
      },
    };

    const response = await axios.post(
      `https://api.agora.io/api/conversational-ai-agent/v2/projects/${process.env.AGORA_APP_ID}/join`,
      payload,
      {
        headers: {
          Authorization: `Basic ${base64}`,
          "Content-Type": "application/json",
        },
      }
    );

    console.log("✅ AGORA AI RESPONSE:", response.data);
    res.json(response.data);
  } catch (error: any) {
    console.error(
      "❌ Error starting AI agent:",
      error.response?.data || error.message
    );
    res.status(500).json(error.response?.data || { error: error.message });
  }
};

// Stop AI controller
export const stopAI = async (req: Request, res: Response) => {
  try {
    const { agent_id } = req.body;
    console.log("🧩 Attempting to stop agent with:", {
      appId: process.env.AGORA_APP_ID,
      agent_id,
      url: `https://api.agora.io/api/conversational-ai-agent/v2/projects/${process.env.AGORA_APP_ID}/agents/${agent_id}/leave`,
    });
    if (!agent_id) return res.status(400).json({ error: "agent_id required" });

    const base64 = Buffer.from(
      `${process.env.AGORA_CUSTOMER_ID}:${process.env.AGORA_CUSTOMER_SECRET}`
    ).toString("base64");

    const response = await axios.post(
      `https://api.agora.io/api/conversational-ai-agent/v2/projects/${process.env.AGORA_APP_ID}/agents/${agent_id}/leave`,
      {},
      {
        headers: {
          Authorization: `Basic ${base64}`,
          "Content-Type": "application/json",
        },
      }
    );

    res.json(response.data);
  } catch (error: any) {
    console.error(
      "❌ Error stopping AI agent:",
      error.response?.data || error.message
    );
    res.status(500).json(error.response?.data || { error: error.message });
  }
};

export const aiCallback = async (req: Request, res: Response) => {
  const event = req.body;

  console.log("\n🛰️ CALLBACK RECEIVED:", new Date().toISOString());
  console.log("📦 Event type:", event.event_type);

  try {
    switch (event.event_type) {
      // 🎙️ User speech result
      case "asr.result":
        console.log(
          `🎙️ You said: ${event.data?.text || "[No text recognized]"}`
        );
        break;

      // 🤖 LLM text reply (Gemini)
      case "llm.reply":
        console.log(`🤖 AI said: ${event.data?.text || "[No LLM reply text]"}`);
        break;

      // 🔊 TTS lifecycle events
      case "tts.start":
        console.log("🔊 TTS playback starting...");
        break;

      case "tts.end":
        console.log("✅ TTS playback finished successfully.");
        break;

      case "tts.error":
        console.log(
          `⚠️ TTS Error: ${event.data?.error_message || "Unknown error"}`
        );
        if (event.data?.vendor) {
          console.log(`   Vendor: ${event.data.vendor}`);
        }
        break;

      // 🧩 Misc internal events (optional)
      default:
        console.log("ℹ️ Unhandled event:", JSON.stringify(event, null, 2));
    }
  } catch (err) {
    console.error("❌ Callback parsing error:", err);
  }

  res.status(200).send("ok");
};
