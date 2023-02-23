const mongoose = require('mongoose')
const form_validator = require('mongoose-unique-validator')


const user_schema = mongoose.Schema({
    fullname:{type:String, required:true},
    email:{type:String, required:true,unique:true},                 
    password:{type:String, required:true},  
},
{
    versionKey:false
}
)

user_schema.plugin(form_validator)

module.exports = mongoose.model('User_auth',user_schema)