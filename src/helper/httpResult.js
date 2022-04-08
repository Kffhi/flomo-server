const responseCode = require('../config/responseCode')

class ResultBody {
    static success(data = null) {
        return {
            code: responseCode.SUCCESS_CODE,
            status: true,
            message: '操作成功',
            data
        }
    }

    static error(errorCode = responseCode.PARAMS_ERROR_CODE, data = null){
        return {
            code: errorCode,
            status: false,
            message: '操作失败',
            data
        }
    }
}

module.exports = ResultBody
