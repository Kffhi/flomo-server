const express = require('express')
const router = express.Router()
const _ = require('lodash')

const fileUtil = require('../helper/fileUtil')
const pathUtil = require('../helper/path')
const memoUtils = require('../businessUtils/memo')
const ResultBody = require('../helper/httpResult')
const dayjs = require('dayjs')
const tagUtils = require('../businessUtils/tag')
const stateUtils = require('../businessUtils/state')

// 获取所有Memos
router.get('/getAll', (req, res) => {
    memoUtils.getAllMemo().then(memos => {
        res.json(ResultBody.success(memos))
    }).catch(err => {
        res.json(ResultBody.error(err))
    })
})

// 通过标签查找memo
router.get('/getByTag', (req, res) => {
    const { tag = '', tagId = '' } = req.query
    memoUtils.getMemoByTag({ tag, tagId }).then(memos => {
        res.json(ResultBody.success(memos))
    }).catch(err => {
        res.json(ResultBody.error(err))
    })
})

// 随机返回一个memo
router.get('/hangout', (req, res) => {
    memoUtils.getMemoHangout().then(memos => {
        res.json(ResultBody.success(memos))
    }).catch(err => {
        res.json(ResultBody.error(err))
    })
})

// 高级查找memo
router.post('/search', (req, res) => {
    const { word = '', date = '' } = req.body
    memoUtils.searchMemo({ word, date }).then(memos => {
        res.json(ResultBody.success(memos))
    }).catch(err => {
        res.json(ResultBody.error(err))
    })
})

// 新增memo
router.post('/add', (req, res) => {
    // TODO: 后面全拆开丢util里去
    const { content } = req.body // memo内容
    const now = Date.now() // 先拿到时间戳
    const month = dayjs(now).format('YYYY-MM') // 匹配memos存储的文件，按月区分
    const day = dayjs(now).format('YYYY年MM月DD日') // 获取当前的日期，用于heatMap更新
    memoUtils.formatContent(content) // 对数据做一次基础的格式化
    const newMemo = memoUtils.getNewMemo(content) // 整理完整内容
    newMemo.host = `${req.socket.remoteAddress}${req.socket.remotePort}` // 加入一下请求标识，这么干纯粹是因为懒得做userId的token之类的了但是感觉还是需要一个标识，不是重点～

    const memoFilePath = pathUtil.getRootPath(`/database/memo/${month}.json`) // 文件路径

    // 处理memo
    const p1 = new Promise((resolve, reject) => {
        // 文件不一定存在，不存在就创建
        fileUtil.checkAndMkFile(memoFilePath).then(() => {
            fileUtil.readJSONFile(memoFilePath).then(async data => {
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
                await fileUtil.writeJSONFile(memoFilePath, memos)
                resolve()
            }).catch(err => {
                reject(err)
            })
        }).catch(err => {
            reject(err)
        })
    })

    // 处理tag
    const p2 = new Promise((resolve, reject) => {
        fileUtil.readJSONFile(pathUtil.getRootPath('/database/tags.json')).then(async data => {
            const tree = await tagUtils.addNewTagsInTree(data, newMemo.tags)
            await fileUtil.writeJSONFile(pathUtil.getRootPath('/database/tags.json'), tree)
            resolve()
        }).catch(err => {
            reject(err)
        })
    })

    // 处理heatMap，这里直接写入是剩的获取数据又去memos里找
    const p3 = new Promise((resolve, reject) => {
        fileUtil.readJSONFile(pathUtil.getRootPath('/database/heatMap.json')).then(async data => {
            const arr = await stateUtils.changeMemoCountInHeatMap(data, day, 'add')
            await fileUtil.writeJSONFile(pathUtil.getRootPath('/database/heatMap.json'), arr)
            resolve()
        }).catch(err => {
            reject(err)
        })
    })

    Promise.all([p1, p2, p3]).then(() => {
        res.json(ResultBody.success())
    }).catch(err => {
        res.json(ResultBody.error(err))
    })
})

// 编辑memo
router.post('/edit', (req, res) => {
    // TODO: 后面全拆开丢util里去
    const { content, id } = req.body
    memoUtils.getAllMemo().then(list => {
        const memo = list.find(item => item.id === id) // 拿到原先的memo
        const month = dayjs(memo.createTime).format('YYYY-MM') // 拿到存储的文件
        // 新的memo数据
        memoUtils.formatContent(content) // 对数据做一次基础的格式化
        const newMemo = {
            content: content,
            updateTime: Date.now(),
            tags: memoUtils.getTagsFromContent(content)
        }

        // 处理memo
        const p1 = new Promise((resolve, reject) => {
            // 重新读文件是为了重新写文件，还是数据库好用
            fileUtil.readJSONFile(pathUtil.getRootPath(`/database/memo/${month}.json`)).then(async data => {
                data.forEach(_memo => {
                    if (_memo.id === id) {
                        // 更新对应memo的数据
                        Object.assign(_memo, newMemo)
                    }
                })
                // 再写回去
                await fileUtil.writeJSONFile(pathUtil.getRootPath(`/database/memo/${month}.json`), data)
                resolve()
            }).catch(err => {
                reject(err)
            })
        })

        // 处理tag
        const p2 = new Promise((resolve, reject) => {
            fileUtil.readJSONFile(pathUtil.getRootPath('/database/tags.json')).then(async data => {
                const tree = await tagUtils.addNewTagsInTree(data, newMemo.tags)
                await fileUtil.writeJSONFile(pathUtil.getRootPath('/database/tags.json'), tree)
                resolve()
            }).catch(err => {
                reject(err)
            })
        })

        Promise.all([p1, p2]).then(() => {
            res.json(ResultBody.success())
        }).catch(err => {
            res.json(ResultBody.error(err))
        })
    })
})

// 删除memo
router.delete('/delete', (req, res) => {
    // TODO: 后面全拆开丢util里去
    const { id } = req.query
    memoUtils.getAllMemo().then(list => {
        const memo = list.find(item => item.id === id) // 拿到原先的memo
        const month = dayjs(memo.createTime).format('YYYY-MM') // 拿到存储的文件

        // 处理memo
        fileUtil.readJSONFile(pathUtil.getRootPath(`/database/memo/${month}.json`)).then(async data => {
            const index = data.findIndex(item => item.id === id)
            data.splice(index, 1)
            // 再写回去
            await fileUtil.writeJSONFile(pathUtil.getRootPath(`/database/memo/${month}.json`), data)
            res.json(ResultBody.success())
        }).catch(err => {
            res.json(ResultBody.error(err))
        })
    })
})

module.exports = router
