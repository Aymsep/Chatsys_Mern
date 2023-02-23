const color = {
    fg:{
        green:"\x1b[32m",
        red:"\x1b[31m",
    }
}




const express = require('express');


const app = express();
const mongoose = require('mongoose');
const jwt  = require('jsonwebtoken');


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

app.use(express.json())

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

// mongoose.connect(process.env.MONGO_URL)
// .then(()=>{
    // console.log("connected to Database")
// }).catch(err =>{
    // console.log('not connected to Database')
// })



app.listen(PORT,()=>{
    console.log('listening on port : '+PORT);
})