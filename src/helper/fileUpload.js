// 引入其他模块
const path = require('path')
const responseCode = require('../config/responseCode')
const { v4: uuidv4 } = require('uuid')
const fileUtil = require('./fileUtil')

/**
 * 上传文件是否被允许
 * @param file 文件流
 * @param exts 扩展名
 * @returns {boolean} true被允许，false不被允许
 */
function fileIsAllowed(file, exts) {
    let result
    if (JSON.stringify(exts) === JSON.stringify([])) {
        result = true
    } else {
        const ext = path.extname(file.originalname).toLowerCase()
        result = exts.includes(ext)
    }
    return result
}

/**
 * 文件复制并返回上传结果信息
 * @param file 文件
 * @param setting 上传设置
 * @returns {Promise<Result>} 文件复制结果
 */
function fileCopy(file, destDir) {
    const destFileName = `${uuidv4()}${path.extname(file.originalname)}` // 直接用uuid替换文件名，防止重名
    const destURL = `${destDir}/${destFileName}` // 完整的路径
    const url = path.join(path.sep, './images/', destFileName).replace(/\\/g, '/') // 静态资源访问路径
    return new Promise((resolve, reject) => {
        // 有路径就复制文件
        if (file.path) {
            fileUtil.copy(file.path, destURL).then(() => {
                resolve({ destURL, url }) // 分别是文件路径和静态资源访问路径
            }).catch(() => {
                reject()
            })
        } else if (file.buffer) {
            // 有二进制buffer就直接写文件
            fileUtil.write(destURL, file.buffer).then(() => {
                resolve({ destURL, url })
            }).catch(err => {
                reject(err)
            })
        }
    })
}

/**
 * 文件上传，暂时只做单文件上传
 * @param file
 * @param setting
 */
function upload(file, setting) {
    return new Promise((resolve, reject) => {
        const { destDir, maxFileNameLength = 50, maxFileSize = 5 * 1024 * 1024, allowFileType = [] } = setting

        // TODO: 应该做一下检查文件目录是否存在，不存在则创建，这里就不写了

        // 文件名验证
        if (file.originalname.length > maxFileNameLength) {
            reject(responseCode.FILE_NAME_TOO_LONG)
        }

        // 文件大小验证
        if (file.size > maxFileSize) {
            reject(responseCode.EXCEED_MAX_FILE_SIZE)
        }

        // 文件扩展名校验
        if (!fileIsAllowed(file, allowFileType)) {
            reject(responseCode.WRONG_FILE_EXT)
        }

        // 文件复制
        fileCopy(file, destDir).then((result) => {
            resolve(result)
        }).catch(err => {
            reject(err)
        })

    })
}

module.exports = {
    upload
}
