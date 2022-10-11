const { v4: uuidv4 } = require('uuid')
const _ = require('lodash')
const fileUtil = require('../helper/fileUtil')
const pathUtil = require('../helper/path')
const dayjs = require('dayjs')

/**
 * 获取memo的数量
 * @returns {Promise<number>}
 */
async function getMemoNumber() {
    const memos = await getAllMemo()
    return memos.length
}

/**
 * 获取所有的memos
 * @returns {Promise<memo[{id: '',content: [], tags: []}]>}
 */
function getAllMemo() {
    return new Promise((resolve, reject) => {
        const files = fileUtil.getAllFile(pathUtil.getRootPath('/database/memo'))
        const promiseList = []
        files.forEach(fileName => {
            const p = fileUtil.readJSONFile(pathUtil.getRootPath(`/database/memo/${fileName}`))
            promiseList.push(p)
        })
        Promise.all(promiseList).then(list => {
            const memos = combineMemoList(list)
            resolve(memos)
        }).catch(err => {
            reject(err)
        })
    })
}

/**
 *  通过标签查找memo
 * @returns {Promise<memo[{id: ''}]>}
 */
function getMemoByTag({ tag = '', tagId = '' }) {
    return new Promise((resolve, reject) => {
        // 先不管只给了id的情况，懒得再查一次tag了
        getAllMemo().then(list => {
            const res = list.filter(item => {
                return  item.tags.findIndex(t => {
                    return (t.includes(`#${tag.trim()}`) || t.includes(`/${tag.trim()}`))
                    // TODO: 这样其实还是有问题，没法区分'#一级/二级/三级'和'#一级/二级额外内容/三级'，不过怎么说搜索也不是重点，先放着
                }) > -1
            })
            resolve(res)
        })
    })
}


/**
 *  TODO: 先只做关键字和日期
 *  查找/高级查找
 * @returns {Promise<memo[{id: ''}]>}
 */
function searchMemo({ word, date }) {
    // 用于记录全部内容的字符串
    let str = ''
    // 内部方法，用于从memo中解析出纯文本内容
    const getStrFromContent = (arr) => {
        arr.forEach(item => {
            if (_.isArray(item.children)) {
                return getStrFromContent(item.children, str)
            }
            if (_.isString(item.text)) {
                str += item.text
            }
        })
    }

    return new Promise((resolve, reject) => {
        getAllMemo().then(list => {
            let res = list
            // 搜索日期
            if (_.isString(date) && date) {
                res = res.filter(item => {
                    return (
                        item?.date === date || dayjs(item.createTime).format('YYYY年MM月DD日') === date
                    )
                })
            }
            // 搜索关键字
            if (_.isString(word) && word) {
                res = res.filter(item => {
                    str = ''
                    getStrFromContent(item.content)
                    item.str = str
                    return item.str.includes(word)
                })
            }
            resolve(res)
        })
    })
}

/**
 *  随机返回一个memo
 * @returns {Promise<memo[{id: ''}]>}
 */
function getMemoHangout() {
    return new Promise((resolve, reject) => {
        getAllMemo().then(list => {
            const index = Math.floor(Math.random() * list.length)
            resolve([list[index]])
        })
    })
}

/**
 * 组装memo   TODO:可能需要排序
 */
function combineMemoList(list) {
    return list.reduce((a, b) => a.concat(b), []).sort((a, b) => b.createTime - a.createTime)
}

/**
 * 根据content解析并返回符合数据库存储内容的完整的memos数据
 * @param content 内容
 */
function getNewMemo(content) {
    const memo = { content }
    memo.id = uuidv4()
    memo.files = [] // TODO: 暂时不支持图片
    memo.userId = 'kffhi'
    memo.createTime = Date.now()
    memo.updateTime = memo.createTime
    memo.date = dayjs(memo.createTime).format('YYYY年MM月DD日')
    memo.tags = getTagsFromContent(content)
    return memo
}

/**
 * 从content中解析tags
 * @param content
 * @returns {string[]} tags
 */
function getTagsFromContent(content) {
    const tags = []

    // 内部函数，做递归用
    const getTags = arr => {
        arr.forEach(item => {
            if (_.isArray(item.children)) {
                getTags(item.children)
            } else if (item.tag) {
                const str = item.text.trim() // 空白标签
                if (str && str !== '#') tags.push(str)
            }
        })
    }

    getTags(content)
    return tags
}

/**
 * 格式化处理content内容，主要是tag标记
 * 直接修改原数据
 * TODO: 和 getTagsFromContent 一起处理的话可以减少一次遍历
 * @param content
 */
function formatContent(content){
    // 内部函数，做递归用
    const getTags = arr => {
        arr.forEach(item => {
            if (_.isArray(item.children)) {
                getTags(item.children)
            } else if (item.tag) {
                const str = item.text.trim() // 空白标签
                // TODO: 先简单的处理一下不是tag的情况
                // 理想情况下应该能在这里把tag和不同文本节点区分开
                // 再对node做一下整体的整理，减少节点数
                // TODO: 这里处理归处理，还是觉得应该在编辑的时候就把标签高亮显示处理
                if(str[0] !== '#'){
                    item.tag = false
                }
            }
        })
    }

    getTags(content)
}

module.exports = {
    formatContent,
    searchMemo,
    getMemoHangout,
    getMemoByTag,
    getTagsFromContent,
    getAllMemo,
    getNewMemo,
    getMemoNumber,
    combineMemoList
}
