/**
 * JSON 数组转map
 * @param json json数组
 * @returns {Map<unknown, unknown>} map结构
 */
function JSON2Map(json) {
    return new Map(json)
}

/**
 *
 * @param map map结构
 * @returns {*[]} json数组
 */
function Map2JSON(map) {
    return [...map]
}

/**
 * 将key相同的一项移至数组第一项
 * @param arr
 * @param key
 * @returns {*[]|*}
 */
function moveItemToFirst(arr, key) {
    const index = arr.findIndex(item => item.id === key)
    if (index === -1) {
        // 如果没有找到对应的项，则返回原数组
        return arr
    } else {
        // 如果找到了对应的项，则将其移到数组的第一项
        const item = arr.splice(index, 1)[0]
        return [item, ...arr]
    }
}


module.exports = {
    JSON2Map,
    Map2JSON,
    moveItemToFirst
}
