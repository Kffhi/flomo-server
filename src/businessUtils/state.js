const tagUtils = require('../businessUtils/tag')
const memoUtils = require('../businessUtils/memo')
const dateUtils = require('../helper/date')

/**
 * 组合完整的用户数据
 * @param userInfo
 * @returns {*}
 */
async function getCompleteUserInfo(userInfo) {
    const { registerTime = Date.now() } = userInfo
    userInfo.tagNumber = await tagUtils.getTagNumber()
    userInfo.memoNumber = await memoUtils.getMemoNumber()
    userInfo.duration = dateUtils.getDuration(registerTime).day
    console.log('userInfo0-----', userInfo)
    return userInfo
}

module.exports = {
    getCompleteUserInfo
}
