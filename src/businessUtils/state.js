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
    return userInfo
}

/**
 * 在heatMap中增减memo的数目
 * @param heatMap 热力图数据
 * @param day 日期
 * @param type 枚举（add，delete）加一或者减一，先这样吧，后面有批量修改啥再说
 */
function changeMemoCountInHeatMap(heatMap, day, type) {
    console.log('-------',heatMap)
    let curDay = heatMap.find(item => item[0] === day)
    if (curDay) {
        /// 区分是新增还是删除
        if (type === 'add') {
            curDay[1].times += 1
        } else {
            curDay[1].times -= 1
        }
    } else {
        // 不存在肯定是add
        curDay = [
            day, {
                date: day,
                times: 1
            }
        ]
        heatMap.push(curDay)
    }
    return heatMap
}

module.exports = {
    getCompleteUserInfo,
    changeMemoCountInHeatMap
}
