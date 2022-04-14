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

module.exports = {
    JSON2Map,
    Map2JSON
}
