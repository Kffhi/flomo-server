const express = require('express')
const router = express.Router()

// const constant = require('../config/constant')
const responseCode = require('../config/responseCode')
const fileUtil = require('../helper/fileUtil')
const pathUtil = require('../helper/path')
const tagUtils = require('../businessUtils/tag')

// 获取所有标签
router.get('/getAll', (req, res) => {
    fileUtil.readJSONFile(pathUtil.getRootPath('/database/tags.json')).then(data => {
        // TODO: 需要根据sortId进行排序
        res.json({
            status: responseCode.SUCCESS_CODE,
            message: '获取成功',
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

// 新增标签
router.get('/add', (req, res) => {
    fileUtil.readJSONFile(pathUtil.getRootPath('/database/tags.json')).then(data => {
        tagUtils.addNewTagInTree(data, req.query.content).then(tree => {
            fileUtil.writeJSONFile(pathUtil.getRootPath('/database/tags.json'), tree).then(() => {
                res.json({
                    status: responseCode.SUCCESS_CODE,
                    message: '创建标签成功',
                    data: tree
                })
            })
        })
    }).catch(err => {
        res.json({
            status: err,
            message: '创建标签失败',
            data: null
        })
    })
})

module.exports = router
