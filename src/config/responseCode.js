const SUCCESS_CODE = 200 // 请求成功

const PARAMS_ERROR_CODE = 500 // 请求处理失败

// 文件错误码
// 文件内容为空
const FILE_CONTENT_NULL = 501
// 文件读取错误
const FILE_READ_ERROR = 502
// 文件目录读取错误
const DIR_READ_ERR = 503
// 获取文件状态错误
const FILE_STATE_ERROR = 504
// 文件打开错误
const FILE_OPEN_ERROR = 505
// 文件写入错误
const FILE_WRITE_ERROR = 506
// 文件关闭错误
const FILE_CLOSE_ERROR = 507

// 文件上传失败
const UPLOAD_FAILED = 600
// 上传文件为空
const UPLOAD_FILE_IS_NULL = 601
// 文件名称太长
const FILE_NAME_TOO_LONG = 602
// 超过最大文件大小限制
const EXCEED_MAX_FILE_SIZE = 603
// 错误的文件扩展名
const WRONG_FILE_EXT = 604
// 上传的文件已经存在
const UPLOAD_FILE_HAS_EXIST = 605

module.exports = {
    UPLOAD_FILE_HAS_EXIST,
    WRONG_FILE_EXT,
    EXCEED_MAX_FILE_SIZE,
    FILE_NAME_TOO_LONG,
    UPLOAD_FILE_IS_NULL,
    UPLOAD_FAILED,
    PARAMS_ERROR_CODE,
    SUCCESS_CODE,
    FILE_CONTENT_NULL,
    FILE_READ_ERROR,
    DIR_READ_ERR,
    FILE_STATE_ERROR,
    FILE_OPEN_ERROR,
    FILE_WRITE_ERROR,
    FILE_CLOSE_ERROR
}
