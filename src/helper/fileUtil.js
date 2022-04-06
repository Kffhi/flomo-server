// 引入其他模块
const fs = require('fs')
const path = require('path')
const constant = require('../config/constant')
const responseCode = require('../config/responseCode')

/**
 * 获取读文件流
 * @param filePath 文件路径
 * @param options 可选设置
 * @returns {ReadStream} 读文件流
 */
function getReadStream(filePath, ...options) {
    const { flag } = options.length > 0 ? options[0] : {}
    const readStream = fs.createReadStream(filePath, {
        flags: flag || 'r'
    })
    return readStream
}

/**
 * 读取文件内容为字符串
 * @param filePath 文件路径
 * @param options 可选设置
 * @returns {Promise<unknown>} Promise
 */
function readAsString(filePath, ...options) {
    return new Promise((resolve, reject) => {
        const { encoding } = options
        const readStream = getReadStream(filePath, options)
        readStream.setEncoding(encoding || 'utf-8')
        let data = ''
        readStream.on('data', chunk => {
            data += chunk
        })
        readStream.on('end', () => {
            console.log(`${path.basename(filePath)} => read success`)
            if (data.length === 0) {
                reject(responseCode.FILE_CONTENT_NULL)
            } else {
                resolve(data)
            }
        })
        readStream.on('error', err => {
            console.log('读取文件错误', err)
            reject(responseCode.FILE_READ_ERROR)
        })
    })
}

/**
 * 读取JSON文件
 * @param fileDir 文件目录
 * @param fileName 文件名
 * @param options 可选设置
 * @returns {Promise<any>} Promise
 */
function readJSONFile(filePath, ...options) {
    return new Promise((resolve, reject) => {
        readAsString(filePath, options).then(data => {
            resolve(JSON.parse(data))
        }).catch(err => {
            reject(err)
        })
    })
}

/**
 * 获取写文件流
 * @param filePath 文件路径
 * @param options 可选设置
 * @returns {WriteStream} 写文件流
 */
function getWriteStream(filePath, ...options) {
    let { flag } = options.length > 0 ? options[0] : {};
    const writeStream = fs.createWriteStream(filePath, {
        flags: flag || 'w'
    });
    return writeStream;
}

module.exports = {
    getReadStream,
    readAsString,
    readJSONFile,
    getWriteStream
}
