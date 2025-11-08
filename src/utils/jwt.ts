import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
dotenv.config();

const JWT_SECRET =process.env.JWT_SECRET as string ||"jwtsecret"
const JWT_EXPIRES_IN= process.env.JWT_EXPIRES_IN || "2d";

export const generateToken =(payload:object):string=>{
    return jwt.sign(payload,JWT_SECRET,{expiresIn:"7d"})
};

export const verifyToken =(token:string):any=>{
    try {
        return jwt.verify(token,JWT_SECRET)
    } catch (error) {
        return null;
    }
}