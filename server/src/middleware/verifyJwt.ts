import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

export const verifyJwt = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }

  try {
    const decoded = jwt.verify(
      token,
      process.env.ACCESS_TOKEN_SECRET!
    ) as jwt.JwtPayload;
    // ensure we store the id as a string on the request
    if (decoded && (decoded as any).userId) {
      req.userId = String((decoded as any).userId);
    }
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid token", error: err });
  }
};
