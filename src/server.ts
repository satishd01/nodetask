import http from 'http'
import app from './app'
import {Server as SocketIOServer} from 'socket.io'
import dotenv from 'dotenv'
import cookie from 'cookie'
import { verifyToken } from './utils/jwt'
import pool from './db'
import { Socket } from 'dgram'
dotenv.config();

const PORT =  Number(process.env.PORT||4000);
const server = http.createServer(app);
const io = new SocketIOServer(server,{
    cors:{origin:true,credentials:true}
})

io.use(async (Socket,next)=>{
try {
    const cookies = Socket.handshake.headers.cookie;
    const cookieName = process.env.COOKIE_NAME ||"token";
    let token:string | undefined;
    if(cookies){
        const parsed = cookie.parse(cookies);
        token = parsed[cookieName];
    }
    if(!token)token=(Socket.handshake.query && (Socket.handshake.query.token as string));

    const payload = verifyToken(token) as {id:number};
    const [rows]= await pool.query('SELECt current_token, id FROM users WHERE id=?',[payload.id]);
    const user = (rows as any[])[0];
    (Socket  as any).user ={id:payload.id};
    next();

} catch (error) {
    console.log(error)
}
});

io.on('connection',(Socket)=>{
    const uid=(Socket as any).user?.id;
    console.log(uid);
    Socket.join(`user_${uid}`);
        Socket.on('message',(data)=>{
        io.to("global").emit("message",{
            from:uid,...data
        })
    })
    Socket.on('joinRoom',(room)=>{
        Socket.join(room)
    })
        Socket.on('disconnect',()=>{
        console.log("disconnected")
        
    })
})

server.listen(PORT,()=>{
    console.log(`serever listening on posrt ${PORT}`);
})