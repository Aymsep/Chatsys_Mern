exports.login = (req, res, next) => {
    console.log('login')
}

exports.register = (req, res, next) => {
    console.log(req.body)
    res.status(200).json(req.body)
    
}