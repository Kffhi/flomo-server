/**
 * 获取memo的数量
 * @returns {number}
 */
async function getMemoNUmber(){
    return 0
}

/**
 * 组装memo   TODO:可能需要排序
 */
function combineMemoList(list){
    return list.reduce((a,b) => a.concat(b), []).sort((a,b) => a.createTime + b.createTime)
}

module.exports={
    getMemoNUmber,
    combineMemoList
}
