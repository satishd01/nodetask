import { Request, Response } from "express";
import pool from "../db";
import { AuthRequest } from "../middelware/auth.middelware";

export async function getUsers(req: Request, res: Response) {
  try {
    const [rows] = await pool.query(
      "SELECT id, email, name, created_at FROM users"
    );
    return res.json(rows); // ✅ use res.json, not response.json
  } catch (error) {
    console.error("GetUsers error:", error);
    return res.status(500).json({ message: "Server error" });
  }
}

export async function getProfile(req: AuthRequest, res: Response) {
  try {
    return res.json({
      id: req.user?.id,
      email: req.user?.email,
      name: req.user?.name,
    });
  } catch (error) {
    console.error("GetProfile error:", error);
    return res.status(500).json({ message: "Server error" });
  }
}
