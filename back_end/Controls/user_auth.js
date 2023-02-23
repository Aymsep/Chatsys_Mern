const bcrypt = require('bcrypt')
const uuid = require('uuid')
const users = []

exports.login = async (req, res, next) => {
    const user_find = await users.find(user => user.email == req.body.email)    
    console.log(user_find)
    if(user_find == null) {
        return res.status(404).send({
            message:'user not found'
        })
    }
    try{
        const check_match = bcrypt.compare(req.body.email, user_find.password)
        if(check_match){
            return res.send({
                message: 'password match'
            })
        }else{
            return res.send({
                message: 'password not match'
            })
        }

    }catch{
        res.status(500).send()
    }
    
    
    
    
    
    
    
    
    

    
    
    


   
   
   
   
    
}









exports.register = async (req, res, next) => {
   try{
    const hashedpass = await bcrypt.hash(req.body.password,10)
    const user  = {
        id:uuid.v4(),
        name: req.body.name,
        email: req.body.email,
        password: hashedpass
    }
    res.status(201).send({
        message: 'user created succedfully'
       })
       users.push(user)
   }catch{
    res.status(500).json({message: 'user not created'})
   }
  
}


exports.getusers =  (req, res, next) => {
    res.status(200).send(users)
}