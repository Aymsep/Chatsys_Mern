const color = {
    fg:{
        green:"\x1b[32m",
        red:"\x1b[31m",
    }
}




const express = require('express');
const cookiesParser = require('cookie-parser')
const cors = require('cors')
const app = express();
const mongoose = require('mongoose');
const jwt  = require('jsonwebtoken');
const ws = require('ws');

const dotenv = require('dotenv');
dotenv.config()

const router = require('./Routes/user_auth');
const PORT = process.env.PORT || 3005;

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
});


app.use(cookiesParser())
app.use(express.json())
app.use(cors({ origin:'http://localhost:3000', credentials:true }))


app.use('/',router)


mongoose.set('strictQuery', false)
mongoose.connect(process.env.MONGO_URL)
.then(()=>{
    console.log(color.fg.green,'Connected To Database ✓')
})
.catch((error)=>{
    console.log(color.fg.red,'Unable To Connect To Database')
    console.error(error)
})



const server = app.listen(PORT,()=>{
    console.log('listening on port : '+PORT);
})

const wss = new ws.WebSocketServer({server})
wss.on('connection',(socket,req)=>{
    console.log(color.fg.green,'websocket server connected  ✓')
   socket.on('message',(message)=>{
    const ws_token = `${message}`
    if(ws_token){
        jwt.verify(ws_token,process.env.JWT_SECRET_ACESS ,{},(err,userData)=>{
            if(err) throw err;
            const {userId,fullname} = userData
            socket.userId = userId
            socket.fullname = fullname
            console.log(userId)
        })
    }
    [...wss.clients].forEach(client=>{
        console.log(client.fullname)
        client.send(JSON.stringify({
            online:[...wss.clients].map(c => ({fullname:c.fullname,userId:c.userId}))
        }))
    })
   })
})
