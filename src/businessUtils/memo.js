const { v4: uuidv4 } = require('uuid')
const _ = require('lodash')
const fileUtil = require('../helper/fileUtil')
const pathUtil = require('../helper/path')
const ResultBody = require('../helper/httpResult')

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
                // 给过来的标签和memo下的格式不是完全一致
                return item.tags.includes(`#${tag.trim()}`)
            })
            resolve(res)
        })
    })
}

/**
 *  TODO: 先只做关键字
 *  查找/高级查找
 * @returns {Promise<memo[{id: ''}]>}
 */
function searchMemo({ word }) {
    // 用于记录全部内容的字符串
    let str = ''
    // 内部函数，内容拼接
    const getStr = (arr) => {
        arr.forEach(item => {
            if (_.isArray(item.children)) {
                getStr(item.children)
            }
            if (_.isString(item.text)) {
                str += item.text
            }
        })
    }

    return new Promise((resolve, reject) => {
        getAllMemo().then(list => {
            const res = list.filter(item => {
                str = ''
                getStr(item.content)
                item.str = str
                return item.str.includes(word)
            })
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
                tags.push(item.text.trim())
            }
        })
    }

    getTags(content)
    return tags
}

module.exports = {
    searchMemo,
    getMemoHangout,
    getMemoByTag,
    getTagsFromContent,
    getAllMemo,
    getNewMemo,
    getMemoNumber,
    combineMemoList
}
