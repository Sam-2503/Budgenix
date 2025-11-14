import express, { Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectToMongoDB } from "./databases/mongo.db.js";
import userRoutes from "./routes/user.routes.js";
import expenseRoutes from "./routes/expense.routes.js";

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT ?? 3300;

app.use(cors());
app.use(express.json());

// Health check
app.get("/api/health", (req: Request, res: Response) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// Root endpoint
app.get("/", (req: Request, res: Response) => {
  res.send("Budgenix server (TypeScript) is running");
});


// User routes
app.use("/api/users", userRoutes);
app.use("/api/expenses",expenseRoutes ); // Placeholder for expenses routes

// Start the server after connecting to the database
connectToMongoDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("Failed to connect to the database:", error);
  });

export default app;
