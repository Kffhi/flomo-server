const path = require('path')

/**
 * 获取文件完整的路径
 * @param filePath 文件相对于src的路径
 * @returns {string} 文件完整的根路径
 */
function getRootPath(filePath) {
    return path.join(path.resolve('./'), `/src${filePath}`)
}

module.exports = {
    getRootPath
}
