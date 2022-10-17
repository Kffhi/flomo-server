const express = require('express')
const pathUtil = require('./helper/path')

const app = express()
const hostname = 'localhost'
const port = process.env.PORT || 2022

require('./middleWare/config')(app)

app.use(express.static(pathUtil.getRootPath('/database/public'))) // 开放静态资源文件夹

module.exports = app.listen(port, () => {
    console.log(`Server listening on http://${hostname}:${port}, Ctrl+C to stop`)
})
