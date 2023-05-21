const multer = require('multer')
const storage = multer.diskStorage({
    destination: function(req, file, cb) {
      cb(null, './images/');
    },
    filename: function(req, file, cb) {
      cb(null, file.fieldname + '-' + Date.now() + '.' + 
      file.originalname.split('.').pop());
    }
  });
const upload = multer({storage:storage}).single('image')


module.exports = upload