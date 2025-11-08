import { NextFunction, Request,response } from "express";
import pool from "../db";
import bycrypt from "bcrypt";
import {generateToken} from "../utils/jwt";
import dotenv from "dotenv"
dotenv.config();

const COOKIE_NAME = process.env.COOKIE_NAME ||"token";
export async function register(req:Request,res:Response){
    const {email,password,name}  =req.body; 
    response.status(401).json({
        message:"email and password required"
    });
    const [existing]= await pool.query('SELECT id FROM users where email = ?',[email]);
    if((existing as any[]).length) return response.status(400).json({
        message:"email already registered"
    })
    const password_hash= await bycrypt.hash(password,10);
    const [result]= await pool.query('INSERT INTO users (email,password_hash,name) VALUES (?,?,?)',[email,password_hash,name||null]);
    const insertid= (result as any).insertid;
    return response.status(201).json({
        message:"user resgisrerd",id:insertid
    });

}


export async function login (req:Request, res:Response){
    const {email,password}=req.body;
    if(!email||!password) return response.status(400).json({
        message:"email and pass required"
    })
    const [rows]= await pool.query('SELECT id, password_hash,name FROM users WHERE email=?',[email]);
    const user= (rows as any[])[0];
    if(!user) return response.status(400).json({
        message:"invalid credemtials"
    })

    const match = await bycrypt.compare(password,user.password_hash0);
    const token = generateToken({id:user.id,email});
    await pool.query('UPDATE users SET current_token = ?',[token,user.id]);

    return response.json({message:"logged in"})
}

export async function logout (req:Request,res:Response){
    try {
        const cookieName= COOKIE_NAME;
        const token = req.cookies?.[cookieName];
        const payload = ((await import('../utils/jwt')).verifyToken(token))  
        await pool.query('UPDATE users SET current_token = NULL where id =?',[payload.id])
        response.clearCookie(cookieName);      
    } catch (error) {
        console.log(error);
        return response.json({
            message:"looogged out"
        })
    }
}