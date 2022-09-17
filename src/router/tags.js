const express = require('express')
const router = express.Router()
const _ = require('lodash')

// const constant = require('../config/constant')
// const responseCode = require('../config/responseCode')
const fileUtil = require('../helper/fileUtil')
const pathUtil = require('../helper/path')
const tagUtils = require('../businessUtils/tag')
const ResultBody = require('../helper/httpResult')

// 获取所有标签
router.get('/getAll', (req, res) => {
    fileUtil.readJSONFile(pathUtil.getRootPath('/database/tags.json')).then(data => {
        const sortTree = tagUtils.sortTreeBySortId(_.cloneDeep(data))
        res.json(ResultBody.success(sortTree))
    }).catch(err => {
        res.json(ResultBody.error(err))
    })
})

// 新增标签
router.post('/add', (req, res) => {
    fileUtil.readJSONFile(pathUtil.getRootPath('/database/tags.json')).then(async data => {
        const tree = await tagUtils.addNewTagInTree(data, req.body.tag)
        await fileUtil.writeJSONFile(pathUtil.getRootPath('/database/tags.json'), tree)
        res.json(ResultBody.success())
    }).catch(err => {
        res.json(ResultBody.error(err))
    })
})

// 标签重命名及修改图标
router.post('/edit', (req, res) => {
    const { id, content, icon } = req.body
    fileUtil.readJSONFile(pathUtil.getRootPath('/database/tags.json')).then(data => {
        const tarTag = tagUtils.findTagInTreeById(id, data)
        if (_.isString(icon) && icon) tarTag.icon = icon
        if (_.isString(content) && content) {
            tarTag.value = content
            // TODO: 如果是重命名需要修改对应的所有Memo中的内容
        }
        res.json(ResultBody.success())
    }).catch(err => {
        res.json(ResultBody.error(err))
    })
})

module.exports = router
