const express = require('express');
const router  = express.Router()
const auth = require('../Controls/user_auth')
const {validateToken} = require('../jwt')

router.post('/register',auth.register)
router.post('/login',auth.login)
router.get('/profile',auth.getprofile)
router.post('/message/:id',auth.getmessage)

module.exports = router