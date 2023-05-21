const express = require('express');
const router  = express.Router()
const auth = require('../Controls/user_auth')
const upload_file = require('../Middleware/multer')
const {validateToken} = require('../jwt')

router.post('/register',upload_file,auth.register)
router.post('/login',auth.login)
router.get('/profile',auth.getprofile)
router.post('/message/:id',auth.getmessage)

module.exports = router