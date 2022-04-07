const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const path = require('path')

module.exports = app => {

    // CORS跨域
    let corsOpt = {
        origin: '*',
        optionsSuccessStatus: 200
    }
    app.use(cors(corsOpt))

    // 静态文件托管
    app.use(express.static(path.join(__dirname, 'public')))

    // 解析请求体数据
    app.use(bodyParser.json())
    app.use(bodyParser.urlencoded({ extended: false }))

    // 路由
    require('../router')(app)
}


