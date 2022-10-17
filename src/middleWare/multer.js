const multer = require('multer')

const upload = multer()
// const upload = multer({ dest: pathUtil.getRootPath('/database/upload') })

module.exports = {
    upload
}
