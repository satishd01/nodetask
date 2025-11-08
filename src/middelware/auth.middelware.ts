import { Request, Response, NextFunction } from "express";
import { verifyToken } from "../utils/jwt";
import pool from "../db";

export interface AuthRequest extends Request {
  user?: { id: number; email: string; name?: string };
}

export async function authMiddleware(
  req: AuthRequest,
  res: Response,
  next: NextFunction
) {
  try {
    const cookieName = process.env.COOKIE_NAME || "token";
    const token =
      req.cookies?.[cookieName] ||
      req.header("authorization")?.replace("Bearer ", "");

    if (!token) {
      return res.status(401).json({ message: "No token provided" });
    }

    const payload = verifyToken(token) as { id: number; email: string };
    const [rows] = await pool.query(
      "SELECT id, email, name, current_token FROM users WHERE id = ?",
      [payload.id]
    );

    const results = Array.isArray(rows) ? rows : [];
    const user = results[0] as any;

    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    if (!user.current_token || user.current_token !== token) {
      return res.status(401).json({ message: "Session expired" });
    }


    req.user = { id: user.id, email: user.email, name: user.name };

    next();
  } catch (error) {
    console.error("Auth error:", error);
    return res.status(401).json({ message: "Unauthorized" });
  }
}
