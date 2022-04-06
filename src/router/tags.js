const fileUtil = require('../helper/fileUtil')
const path = require("path");
const router = require('./index')

function getAllTag() {
    router.get('/getTag', (req, res) => {
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
}

module.exports = {
    getAllTag
}
