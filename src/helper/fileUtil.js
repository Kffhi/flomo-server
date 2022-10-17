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
                // TODO: 不应该这么写的，不过这repo就这么几个文件，逻辑定死
                resolve('{}')
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
 * 获取文件夹下所有的文件
 * @param filePath 文件路径
 * @returns fileNames[] 文件名数组
 */
function getAllFile(dirPath) {
    return fs.readdirSync(dirPath)
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

/**
 * 检测文件是否存在，不存在则创建
 * @param filePath 文件路径
 * @returns {Promise<void>}
 */
function checkAndMkFile(filePath) {
    return new Promise((resolve, reject) => {
        fs.open(filePath, 'wx', (err, fd) => {
            if (err) {
                if (err.code === 'EEXIST') {
                    // 文件已存在
                    resolve()
                } else {
                    // 其他文件打开错误
                    reject(responseCode.FILE_OPEN_ERROR)
                }
            } else {
                // 写完后记得关闭，否则对文件的其他操作可能会出现错误
                fs.close(fd, (err) => {
                    if (err) {
                        reject(responseCode.FILE_CLOSE_ERROR)
                    } else {
                        // 使用wx的方式打开，如果文件不存在会自动创建
                        resolve()
                    }
                })
            }
        })
    })
}

/**
 * 文件复制
 * @param srcPath 源文件路径
 * @param destPath 目标文件路径
 */
async function copy(srcPath, destPath) {
    return new Promise((resolve, reject) => {
        const readStream = getReadStream(srcPath)
        const writeStream = getWriteStream(destPath)
        readStream.pipe(writeStream)
        readStream.on('error', err => {
            reject(false)
        })
        writeStream.on('finish', () => {
            resolve(true)
        })
        writeStream.on('error', (err) => {
            reject(false)
        })
    })
}

module.exports = {
    copy,
    checkAndMkFile,
    getAllFile,
    getReadStream,
    readAsString,
    readJSONFile,
    getWriteStream,
    write,
    writeJSONFile
}
