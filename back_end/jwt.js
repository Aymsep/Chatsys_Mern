const {sign,verify} = require('jsonwebtoken')
const createToken = (user)=>{
    const accesToken = sign(
        {fullname:user.fullname,id:user._id,image:user.image},
        process.env.JWT_SECRET
    )
    return accesToken;
}

const validateToken = (req, res, next) => {
    // if(!accessToken) return res.status(400).json({err:"user not auth"})
    // try{
        //     const validToken = verify(accessToken,process.env.JWT_SECRET)
        //     if(validToken){
            //         req.authenticated = true
            //         return next()
            //     }
            // }catch(err){
                //     res.status(400).json({err:err.message})
                // }
                next()
            }


module.exports = {createToken,validateToken}