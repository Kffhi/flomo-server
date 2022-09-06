/**
 * 获取memo的数量
 * @returns {number}
 */
async function getMemoNumber(){
    return 0
}

/**
 * 组装memo   TODO:可能需要排序
 */
function combineMemoList(list){
    return list.reduce((a,b) => a.concat(b), []).sort((a,b) => b.createTime - a.createTime)
}

module.exports={
    getMemoNUmber,
    combineMemoList
}
