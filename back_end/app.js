const color = {
    fg:{
        green:"\x1b[32m",
        red:"\x1b[31m",
    }
}


const fs = require("fs");
const path = require("path");
const {buffer} = require('buffer')

const express = require('express');
const cookiesParser = require('cookie-parser')
const cors = require('cors')
const app = express();
const mongoose = require('mongoose');
const jwt  = require('jsonwebtoken');
const ws = require('ws');
const Message = require('./Schemas/user_message')


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
app.use('/images', express.static(__dirname + '/images'));
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

let isFirstMessageReceived = false;
const wss = new ws.WebSocketServer({server})



let receivedToken = false;







      
let token_current = '';

app.post('/', (req, res, next) => {
  token_current = req.body.tkn;
    res.send('Token received');
});

function waitForToken() {
  return new Promise((resolve, reject) => {

    if (token_current) {
      resolve(token_current);
    } else {

      const intervalId = setInterval(() => {
        if (token_current) {
          clearInterval(intervalId);
          resolve(token_current);
        }
      }, 100);
    }
  });
}

wss.on('connection', (socket, req) => {
  console.log(color.fg.green, 'websocket server connected  ✓');
  waitForToken().then((token) => {
      if (token) {
        console.log('entered')
        receivedToken = true;
        jwt.verify(token, process.env.JWT_SECRET_ACESS, {}, (err, userData) => {
          if (err) throw err;
          const { userId, fullname,image } = userData;
          console.log('userimage ',image)
          socket.userId = userId;
          socket.fullname = fullname;
          socket.image = image;

          [...wss.clients].forEach((client) => {
            client.send(JSON.stringify({
              online: [...wss.clients].map((c) => ({ fullname: c.fullname, userId: c.userId,image:c.image })),
            }));
          });
        }) ;
      }   
    
  })
  socket.on('message',async (msg) =>{
    const message_data = JSON.parse(msg.toString())
    console.log(message_data)
    const {receiver,text,sender,file} = message_data
    if(file){
      const imagebuffer = Buffer.from(file.image,'base64')
      const filepath = path.join(__dirname,'images',file.name);

      [...wss.clients]
      .filter(client => client.userId === receiver )
      .forEach(client => client.send(JSON.stringify({
        image:file.image,
        receiver:receiver,
        sendr:sender,
      })) )

      fs.writeFile(filepath, imagebuffer,(err)=>{
        if(err){
          return console.log('error iamge')
        }else{
          return console.log('image saved')
        }
      })

    }
   console.log('message : ',msg)
    if(receiver && text) {
      const messagedoc = await Message.create({
        sender,
        receiver,
        text
      });
      [...wss.clients]
      .filter(client => client.userId === receiver )
      .forEach(client => client.send(JSON.stringify({
        msg:text,
        receiver:receiver,
        sendr:sender,
        id:messagedoc._id
      })) )

    } 
  })
  // socket.on('connection',()=>{
   
  // })
  socket.on('close',()=>{
    console.log('closed')
  })

}) ;

// Message.collection.remove()

