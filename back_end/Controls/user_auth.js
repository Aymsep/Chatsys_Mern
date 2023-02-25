const bcrypt = require('bcrypt')
const uuid = require('uuid')
const { use } = require('../Routes/user_auth')
const users = []
const User_db = require('../Schemas/user_auth')
const jwt = require("jsonwebtoken")
const {createToken,validateToken}  =require("../jwt")






// exports.login =  (req, res, next) => {
//     User_db.findOne({email:req.body.email}).then((user_check) => {
//         if(!user_check){
//             return res.status(404).send({
//                 message:"user not found"
//             })
//         }
//         bcrypt.compare(req.body.password, user_check.password).then(valid=>{
//             if(!valid){
//                 return res.status(401).send({
//                     message:"password is incorrect"
//                 })
//             }
//             const token = jwt.sign(
//                 {userId:user_check._id},
//                 process.env.JWT_SECRET,
//                 )
//             res.json({
//             id:user_check._id,
//             fullname:user_check.fullname,
//             })
//                 res.cookie('token',token).status(201).json({
//                     fullname:user_check._fullname,
//                     id:user_check._id
//                 })

//             // const token = jwt.sign(
//             //     {userId:user_check._id},
//             //     process.env.JWT_SECRET,
//             //     )
//             //     res.cookie('token',token).status(201).json('ok')
                
//         })
        
        
//     }).catch(err=>{
//         res.status(500).send({})
//         error:err.message 
//     })
//     // try{
//         // const check_match = bcrypt.compare(req.body.email, user_find.password)
//         // if(check_match){
//             // return res.send({
//                 // message: 'password match'
//             // })
//         // }else{
//             // return res.send({
//                 // message: 'password not match'
//             // })
//         // }

//     // }catch{
//         // res.status(500).send()
//     // } 
// }
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
            const token = jwt.sign(
                {userId:user_check._id},
                process.env.JWT_SECRET,
                )
            res.cookie('token',token).status(200).json({
                fullname:user_check.fullname,
                id:user_check._id
            })
        })
    }).catch(err => {
        console.log(err);
        res.status(500).json({
            error: err
        });
    });
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
    const token = req.cookies?.token
    console.log(token)
    if(token){
        jwt.verify(token,process.env.JWT_SECRET,{},(err,userdata)=>{
            if(err) throw err;
            res.json(userdata)
        })
    }else{
        res.status(401).json('no token')
    }
}

