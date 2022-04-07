// 引入其他模块
const fs = require('fs')
const path = require('path')
// const constant = require('../config/constant')
const responseCode = require('../config/responseCode')

/**
 * 获取读文件流
 * @param filePath 文件路径
 * @param options 可选设置
 * @returns {ReadStream} 读文件流
 */
function getReadStream(filePath, ...options) {
    const { flag } = options.length > 0 ? options[0] : {}
    return fs.createReadStream(filePath, {
        flags: flag || 'r'
    })
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
 * @param filePath 文件路径
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
    let { flag } = options.length > 0 ? options[0] : {}
    return fs.createWriteStream(filePath, {
        flags: flag || 'w'
    })
}

/**
 * 写文件
 * @param filePath 文件路径
 * @param data 数据
 * @param options 可选设置
 * @returns {Promise<unknown>} Promise
 */
function write(filePath, data, ...options) {
    return new Promise((resolve, reject) => {
        const writeStream = getWriteStream(filePath, options)
        writeStream.write(data)
        writeStream.end()
        writeStream.on('finish', () => {
            console.log(`${path.basename(filePath)} => write success`)
            resolve()
        })
        writeStream.on('error', err => {
            console.log('写文件错误', err)
            reject(responseCode.FILE_WRITE_ERROR)
        })
    })
}

/**
 * 写JSON数据
 * @param filePath 文件路径
 * @param data 数据
 * @param options 可选设置
 * @returns {Promise<unknown>} Promise
 */
function writeJSONFile(filePath, data, ...options) {
    return new Promise((resolve, reject) => {
        data = JSON.stringify(data)
        write(filePath, data, options).then(data => {
            resolve(data)
        }).catch(err => {
            reject(err)
        })
    })

}

module.exports = {
    getReadStream,
    readAsString,
    readJSONFile,
    getWriteStream,
    write,
    writeJSONFile
}
