const express = require('express');
const app = express();

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




app.listen(PORT,()=>{
    console.log('listening on port : '+PORT);
})