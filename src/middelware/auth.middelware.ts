import { Request,response,NextFunction } from "express";
import {verifyToken} from '../utils/jwt';
import pool from "../db";
export interface AuthRequest extends Request {
    user?:{id:number;emai:string;name?:string};
}

export async function authMiddleware(req:AuthRequest,res:Response,next:NextFunction){
    try {
        const cookieName = process.env.COOKIE_NAME ||"token";
        const token = req.cookies?.[cookieName] || req.header('authorization')?.replace('Bearer',"");
        const payload = verifyToken(token) as {id:number;email:string};
        const [rows]= await pool.query('SELECT id,email,name,current_token FROM users WHERE id = ?',[payload.id]);
        const results = Array.isArray(rows) ? rows : [];
        const user = results[0] as any;
        if(!user) return response.status(401).json({
            message:"user not found"
        });
        if(!user.current_token || user.current_token!==token) {
            return response.status(401).json({
                message:"sessiom expired"
            })
        }
        req.user= {id:user.id,emai:user.email,name:user.name};
        next();
    } catch (error) {
        console.log("auth error",error)
        return response.status(401).json({
            message:"unauthorized"
        })
    }
}

