const express = require("express")
const router = express.Router()
const path = require("path")

const fileUtil = require('../helper/fileUtil')

router.get('/getAll', (req, res) => {
    fileUtil.readJSONFile(path.resolve(__dirname, '../database/tags.json')).then(data => {
        res.json({
            status: '200',
            data
        })
    }).catch(err => {
        res.json({
            status: err,
            message: '读取文件错误',
            data: null
        })
    })
})

module.exports = router
