const bcrypt = require('bcrypt')
const uuid = require('uuid')
const users = []
const User_db = require('../Schemas/user_auth')
const jwt = require("jsonwebtoken")
const {createToken,validateToken}  =require("../jwt")
const Message = require('../Schemas/user_message')





exports.login = (req, res, next) => {
    User_db.findOne({ email: req.body.email })
      .then((user_check) => {
        if (!user_check) {
          return res.status(404).send({
            message: 'User not found',
          })
        }
        bcrypt.compare(req.body.password, user_check.password).then((valid) => {
          if (!valid) {
            return res.status(401).send({
              message: 'Password is incorrect',
            })
          }
          const token = jwt.sign(
            { userId: user_check._id,fullname:user_check.fullname},
            process.env.JWT_SECRET_ACESS,
            {expiresIn:'2d'}
          )
          res.cookie("jwt", token, {
            secure: true,
            httpOnly: true,
            sameSite: "None", // I add this line
      }); 
          // res.cookie('token', token, {
          //   sameSite: 'none',
          //   secure: true,
          //   httpOnly: true,
          // })
        
          res.status(200).json({
            fullname: user_check.fullname,
            id: user_check._id,
            token:token
          })
        })
      })
      .catch((err) => {
        res.status(500).json({
          error: err,
        })
      })
  }
   








exports.register = async (req, res, next) => {
   try{
    const hashedpass = await bcrypt.hash(req.body.password,10)
    const user  = new User_db ({
        fullname: req.body.name,
        email: req.body.email,
        password: hashedpass
    })
    user.save().then(()=>{
      console.log('done register')
        return res.status(200).json({
            fullname: user.fullname,
            id: user._id      
        })

    }).catch(err=>{
        return res.status(500).json({
            error:"choose another email"
        })
    })
   }catch{
    res.status(500).json({message: 'user not created'})
   }
  
}


exports.getprofile =  (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1];
    if(token){
        jwt.verify(token,process.env.JWT_SECRET_ACESS,{},(err,userData)=>{
            if(err) throw err;
            const {userId,fullname} = userData
            res.json(userData)
        })
    }else{
        res.status(401).json('no token')
    }
}


exports.getmessage = async (req, res, next) => {
  let id = req.params.id
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1];
  jwt.verify(token,process.env.JWT_SECRET_ACESS,{},async (err,userData)=>{
    if(err) throw err;
    const {userId,fullname} = await userData
    const message = await  Message.find()
    res.status(200).json(
      message
    )
    
})
}


// Message.collection.remove()