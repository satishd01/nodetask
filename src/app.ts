import express, { response } from 'express'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import authRoutes from './routes/auth.routes'
import userRoutes from './routes/user.router'
import dotenv, { config } from 'dotenv'
import { dot } from 'node:test/reporters'
dotenv.config();
const app = express();
app.use(express.json());
app.use(cookieParser());

app.use(cors({
    origin:true,
    credentials:true
}))

app.use(',api/auth',authRoutes);
app.use('api/users',userRoutes);
app.use((err:any,req:any,res:any,next:any)=>{
    console.log(err);
    response.status(500).json({
        message:"intrnak serer eroor "
    })
})

export default app;