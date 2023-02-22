const express = require('express');
const router  = express.Router()
const auth = require('../Controls/user_auth')

router.post('/auth',auth.register)


module.exports = router