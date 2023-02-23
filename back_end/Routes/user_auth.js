const express = require('express');
const router  = express.Router()
const auth = require('../Controls/user_auth')

router.post('/register',auth.register)
router.get('/user',auth.getusers)
router.post('/login',auth.login)

module.exports = router