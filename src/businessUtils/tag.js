const _ = require('lodash')
const { v4: uuidv4 } = require('uuid')
const constant = require('../config/constant')
const responseCode = require('../config/responseCode')
const fileUtil = require('../helper/fileUtil')
const pathUtil = require('../helper/path')

/**
 * 将新的tag字符串插入进已有的tag tree中
 * @param tree tag.json里的tag树
 * @param tagString 标签字符串，格式 '#一级/二级'
 * @returns { Promise<unknown> }
 */
function addNewTagInTree(tree, tagString) {
    return new Promise((resolve, reject) => {
        try {
            const tagArr = tagString.replace('#', '').split('/') // 解析标签，最有可能报错的地方
            let i = 0
            // 在对应arr里查找并增加tag
            const setTagInArr = (arr, pNode = null) => {
                if (i >= tagArr.length) return
                const tagValue = tagArr[i]
                const existTag = arr.find(item => item.value === tagValue) // 查找当前标签是否已经存在
                if (existTag) {
                    // 存在就直接进入下一轮查找
                    i += 1
                    setTagInArr(existTag.children, existTag)
                } else {
                    // 不存在就新增
                    let max = constant.DEFAULT_TAG_SORT_ID
                    arr.forEach(node => {
                        max = Math.max(node.sortId, max) // 拿到当前的最大sortId
                    })
                    const newTagNode = {
                        value: tagValue,
                        id: uuidv4(),
                        pid: pNode ? pNode.id : constant.ROOT_TAG_ID,
                        sortId: max + 1, // 加1，新增的放在最后
                        icon: constant.DEFAULT_TAG_ICON,
                        children: []
                    }
                    arr.push(newTagNode)
                    i += 1
                    // 新增的节点就是新的父节点
                    setTagInArr(newTagNode.children, newTagNode)
                }
            }
            const res = _.cloneDeep(tree)
            setTagInArr(res)
            resolve(res)
        } catch (err) {
            console.log('处理标签参数错误', err)
            reject(responseCode.PARAMS_ERROR_CODE)
        }
    })
}

/**
 * 将标签树按照sortId大小升序排序
 * @param tree 标签树
 * @returns { Array } 排序后的标签树
 */
function sortTreeBySortId(tree) {
    tree.forEach(item => {
        if (item.children.length > 0) {
            return sortTreeBySortId(item.children)
        }
    })
    return tree.sort((a, b) => a.sortId - b.sortId)
}

/**
 * 根据id在树中查找标签
 * @param id 标签id
 * @param tree 标签树
 * @returns {Object | null} 查询结果
 */
function findTagInTreeById(id, tree) {
    const node = tree.find(item => item.id === id)
    if (node) {
        return node
    } else {
        node.forEach(item => {
            if (item.children.length > 0) {
                return findTagInTreeById(id, item.children)
            }
        })
    }
}

async function getTagNumber() {
    const tagsTree = await fileUtil.readJSONFile(pathUtil.getRootPath('/database/tags.json'))
    let tagsNumber = 0
    const fn = (arr) => {
        if (arr) {
            arr.forEach(item => {
                tagsNumber += 1
                if (item.children.length > 0) {
                    fn(item.children)
                }
            })
        }
    }
    fn(tagsTree)
    return tagsNumber
}

module.exports = {
    getTagNumber,
    addNewTagInTree,
    sortTreeBySortId,
    findTagInTreeById
}
