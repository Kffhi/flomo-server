const express = require('express')
const router = express.Router()
const fs = require('fs')
const path = require('path')

router.get('/get', function(req, res) {
    const data = fs.readFileSync(path.resolve(__dirname, '../database/mock.json'), 'utf-8')
    res.json({
        msg: `增加nodemon测试`,
        data: JSON.parse(data)
    })
})

router.get('/set', function(req, res) {
    let data = fs.readFileSync(path.resolve(__dirname, '../database/mock.json'), 'utf-8')
    data = JSON.parse(data)
    data.setMes = req.query.msg
    data = JSON.stringify(data)
    fs.writeFile(path.resolve(__dirname, '../database/mock.json'), data, () => {
        res.json({
            msg: `OK`
        })
    })
})

module.exports = router

