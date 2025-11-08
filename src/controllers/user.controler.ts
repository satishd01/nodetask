import { Request,response } from "express";
import pool from "../db";
import { AuthRequest } from "../middelware/auth.middelware";

export async function getUsers(req:Request,res:Response){
    try {
       const[rows]=await pool.query('SELECT id,email, name, created_at FROM users');
       return response.json(rows) 
    } catch (error) {
        console.log(error)
        return response.status(500).json({message:"serever error"})
    }
}

export async function getProfile(req:AuthRequest,res:Response){
  return response.json({id:req.user?.id,email:req.user?.emai,name:req.user?.name})
}