const express = require('express')
const router = express.Router()
const _ = require('lodash')

const fileUtil = require('../helper/fileUtil')
const pathUtil = require('../helper/path')
const stateUtils = require('../businessUtils/state')
const ResultBody = require('../helper/httpResult')

// 获取所有标签
router.get('/userInfo',  (req, res) => {
    fileUtil.readJSONFile(pathUtil.getRootPath('/database/userInfo.json')).then(async data => {
        const userInfo = await stateUtils.getCompleteUserInfo(data)
        res.json(ResultBody.success(userInfo))
    }).catch(err => {
        res.json(ResultBody.error(err))
    })
})

// 获取所有标签
router.get('/heatMap',  (req, res) => {
    fileUtil.readJSONFile(pathUtil.getRootPath('/database/heatMap.json')).then(async data => {
        res.json(ResultBody.success(data))
    }).catch(err => {
        res.json(ResultBody.error(err))
    })
})

module.exports = router
