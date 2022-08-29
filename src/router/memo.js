const express = require('express')
const router = express.Router()
const _ = require('lodash')

const fileUtil = require('../helper/fileUtil')
const pathUtil = require('../helper/path')
const stateUtils = require('../businessUtils/memo')
const ResultBody = require('../helper/httpResult')

// 获取所有Memos  TODO:分页？查询？
router.get('/getAll', (req, res) => {
    const files = fileUtil.getAllFile(pathUtil.getRootPath('/database/memo'))
    const promiseList = []
    files.forEach(fileName => {
        const p = fileUtil.readJSONFile(pathUtil.getRootPath(`/database/memo/${fileName}`))
        promiseList.push(p)
    })
    Promise.all(promiseList).then(list => {
        const memos = stateUtils.combineMemoList(list)
        res.json(ResultBody.success(memos))
    }).catch(err => {
        res.json(ResultBody.error(err))
    })
})

module.exports = router
