const bcrypt = require('bcrypt')
const uuid = require('uuid')
const { use } = require('../Routes/user_auth')
const users = []
const User_db = require('../Schemas/user_auth')
const jwt = require("jsonwebtoken")
const {createToken,validateToken}  =require("../jwt")






exports.login =  (req, res, next) => {
    User_db.findOne({email:req.body.email}).then((user_check) => {
        if(!user_check){
            return res.status(404).send({
                message:"user not found"
            })
        }
        bcrypt.compare(req.body.password, user_check.password).then(valid=>{
            if(!valid){
                return res.status(401).send({
                    message:"password is incorrect"
                })
            }
            //     jwt.sign({userId:user_check._id,username:user_check.fullname}, process.env.JWT_SECRET, {}, (err, token) => {
            //     if (err) throw err;
            //     res.cookie('token', token, {sameSite:'none', secure:true}).status(201).json({
            //       id: createdUser._id,
            //     });
            //   });
            res.status(200).json({
                id:user_check._id,
                fullname:user_check.fullname,
            })
            next()
            // const token = jwt.sign(
            //     {userId:user_check._id},
            //     process.env.JWT_SECRET,
            //     )
            //     res.cookie('token',token).status(201).json('ok')
                
        })
        
        
    }).catch(err=>{
        res.status(500).send({})
        error:err.message 
    })
    // try{
        // const check_match = bcrypt.compare(req.body.email, user_find.password)
        // if(check_match){
            // return res.send({
                // message: 'password match'
            // })
        // }else{
            // return res.send({
                // message: 'password not match'
            // })
        // }

    // }catch{
        // res.status(500).send()
    // } 
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
    // const token = req.cookies?.token
    // console.log(token)
    // if(token){
    //     jwt.verify(token,process.env.JWT_SECRET,{},(err,userdata)=>{
    //         if(err) throw err;
    //         res.json(userdata)
    //     })
    // }else{
    //     res.status(401).json('no token')
    // }
}

