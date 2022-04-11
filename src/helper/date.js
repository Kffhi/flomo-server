/**
 * 计算时间间隔并返回
 * @param timer
 * @returns {Object}
 */
function getDuration(timer) {
    const now = Date.now()
    return {
        day: Math.floor((
            now - timer
        ) / (
            24 * 60 * 60 * 1000
        ))
    }
}

module.exports = {
    getDuration
}
