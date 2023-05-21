const mongoose = require('mongoose');

const user_message = mongoose.Schema({
    sender:{type: 'string'},
    receiver:{type: 'string'},
    text:{type:'string'}
},{ timestamps: true })



module.exports = mongoose.model('message',user_message)