const { v4: uuidv4 } = require('uuid')
const _ = require('lodash')

/**
 * 获取memo的数量
 * @returns {number}
 */
async function getMemoNumber() {
    return 0
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
    const memos = { content }
    memos.id = uuidv4()
    memos.files = [] // TODO: 暂时不支持图片
    memos.userId = 'kffhi'
    memos.createTime = Date.now()
    memos.updateTime = memos.createTime
    memos.tags = getTagsFromContent(content)
    return memos
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
            } else if(item.tag){
                tags.push(item.text.trim())
            }
        })
    }

    getTags(content)
    return tags
}

module.exports = {
    getTagsFromContent,
    getNewMemo,
    getMemoNumber,
    combineMemoList
}
