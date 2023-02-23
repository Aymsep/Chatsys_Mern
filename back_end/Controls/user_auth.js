const bcrypt = require('bcrypt')
const uuid = require('uuid')
const { use } = require('../Routes/user_auth')
const users = []
const User_db = require('../Schemas/user_auth')


exports.login =  (req, res, next) => {
    User_db.findOne({email:req.body.email}).then((user_check) => {
        if(!user_check){
            return res.status(404).send({
                message:"user not found"
            })
        }
        bcrypt.compare(req.body.password, user_check.password).then(valid=>{
            if(!valid){
                res.status(404).send({
                    message:"password is incorrect"
                })
            }
            res.status(200).send({
                message:"you logged in"
            })
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
    console.log(req.body)
   try{
    const hashedpass = await bcrypt.hash(req.body.password,10)
    const user  = new User_db ({
        fullname: req.body.name,
        email: req.body.email,
        password: hashedpass
    })
    console.log(user)
    user.save().then(()=>{
        return res.status(200).json({
            success: true,
        })
    }).catch(err=>{
        return res.status(500).json({
            error:"choose another email"
        })
    })
       users.push(user)
   }catch{
    res.status(500).json({message: 'user not created'})
   }
  
}


exports.getusers =  (req, res, next) => {
    res.status(200).send(users)
}