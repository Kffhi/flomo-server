const express = require('express')
const router = express.Router()
const _ = require('lodash')

const fileUtil = require('../helper/fileUtil')
const pathUtil = require('../helper/path')
const memoUtils = require('../businessUtils/memo')
const ResultBody = require('../helper/httpResult')
const dayjs = require('dayjs')

// 获取所有Memos  TODO:分页？查询？
router.get('/getAll', (req, res) => {
    const files = fileUtil.getAllFile(pathUtil.getRootPath('/database/memo'))
    const promiseList = []
    files.forEach(fileName => {
        const p = fileUtil.readJSONFile(pathUtil.getRootPath(`/database/memo/${fileName}`))
        promiseList.push(p)
    })
    Promise.all(promiseList).then(list => {
        const memos = memoUtils.combineMemoList(list)
        res.json(ResultBody.success(memos))
    }).catch(err => {
        res.json(ResultBody.error(err))
    })
})

// 新增memo
router.post('/add', (req, res) => {
    const { content } = req.body // memo内容
    const now = Date.now() // 先拿到时间戳
    const month = dayjs(now).format('YYYY-MM') // 匹配memos存储的文件，按月区分
    const day = dayjs(now).format('YYYY年MM月DD日') // 获取当前的日期，用于heatMap更新

    const newMemo = memoUtils.getNewMemo(content) // 整理完整内容
    newMemo.host = `${req.socket.remoteAddress}${req.socket.remotePort}` // 加入一下请求标识，这么干纯粹是因为懒得做userId的token之类的了但是感觉还是需要一个标识，不是重点～

    const filePath = pathUtil.getRootPath(`/database/memo/${month}.json`) // 文件路径

    // TODO：1.更新tags.json；2.更新heatMap.json；3.更新userInfo.json
    // 应该用一个PromiseAll

    // 文件不一定存在，不存在就创建
    fileUtil.checkAndMkFile(filePath).then(() => {
        fileUtil.readJSONFile(filePath).then(async data => {
            // 拿数据
            let memos = []
            if (_.isArray(data)) {
                // 存在就塞进去
                data.push(newMemo)
                memos = data
            } else {
                // 否则直接覆盖
                memos = [newMemo]
            }
            // 写文件
            await fileUtil.writeJSONFile(filePath, memos)
            res.json(ResultBody.success())
        }).catch(err => {
            res.json(ResultBody.error(err))
        })
    }).catch(err => {
        res.json(ResultBody.error(err))
    })


})

module.exports = router
