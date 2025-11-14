import mongoose from "mongoose";
import User, { IUser } from "../models/user.model";
import "dotenv/config";
import { Request, Response } from "express";
import jwt from "jsonwebtoken";

// Generate JWT tokens
export const generateTokens = async (
  userId: string | mongoose.Types.ObjectId
) => {
  try {
    const id = typeof userId === "string" ? userId : userId.toString();
    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      throw new Error("Invalid user ID");
    }
    const accessToken = jwt.sign(
      { userId: id },
      process.env.ACCESS_TOKEN_SECRET!,
      {
        expiresIn: "15m",
      }
    );
    const refreshToken = jwt.sign(
      { userId: id },
      process.env.REFRESH_TOKEN_SECRET!,
      { expiresIn: "7d" }
    );
    return { accessToken, refreshToken };
  } catch (error) {
    console.error("Error generating tokens:", error);
    throw error;
  }
};

// Register user controller
export const registerUser = async (
  req: Request,
  res: Response
): Promise<unknown> => {
  try {
    const { username, email, password, income } = req.body as Partial<IUser>;
    const existingUser = await User.findOne({ $or: [{ username }, { email }] });
    if (existingUser) {
      return res
        .status(400)
        .json({ message: "Username or email already exists" });
    }

    const newUser = new User({
      username,
      email,
      password,
      income,
      categories: [
        "Food",
        "Utilities",
        "Entertainment",
        "Transportation",
        "Healthcare",
      ],
    });
    await newUser.save();
    return res
      .status(201)
      .json({ message: "User registered successfully", newUser });
  } catch (error) {
    return res.status(500).json({ message: "Server error", error });
  }
};

// Login user controller
export const loginUser = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const isMatch = await (user as IUser).comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password" });
    }
    const userId = user._id as mongoose.Types.ObjectId;

    const { accessToken, refreshToken } = await generateTokens(userId);
    return res
      .status(200)
      .json({ message: "Login successful", accessToken, refreshToken, user });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

export const deleteUser = async (req: Request, res: Response) => {
  try {
    const userId = req.userId;
    if (!userId) return res.status(400).json({ message: "Missing user id" });
    const id = typeof userId === "string" ? userId : userId.toString();
    const deletedUser = await User.findByIdAndDelete(id);
    if (!deletedUser) {
      return res.status(404).json({ message: "User not found" });
    }
    return res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};


export const getUserProfile = async (req: Request, res: Response) => {
    try {
        const userId = req.userId;
        if (!userId) return res.status(400).json({ message: "Missing user id" });
        const id = typeof userId === "string" ? userId : userId.toString();
        const user = await User.findById(id).select('-password');
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        return res.status(200).json({ user });
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};