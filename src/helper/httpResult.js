const responseCode = require('../config/responseCode')

class ResultBody {
    static success(data = null) {
        return {
            status: responseCode.SUCCESS_CODE,
            message: '操作成功',
            data
        }
    }

    static error(errorCode = responseCode.PARAMS_ERROR_CODE, data = null){
        return {
            status: errorCode,
            message: '操作失败',
            data
        }
    }
}

module.exports = ResultBody
