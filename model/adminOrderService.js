const db = require('../config/connectDB');

let getAllOrder = async () => {
    const result = await db.query('SELECT IDORDER, STATUSORDER, CREATEON FROM myorder');

    return result[0];
}
//SORT ORDER-MANAGE
let getSortOrder = async (queryFilter) => {
    const {
        sortId: sortId,
        sortStatus: sortStatus,
        sortCreateon: sortCreateon,
        sort: sortFilter
    } = queryFilter;
    let values = [];
    let sql = 'SELECT * FROM myorder';

    if (sortFilter && typeof sortFilter === 'string' && (sortId || sortStatus || sortCreateon)) {
        //sort tăng dần
        if (typeof sortId === 'string') {
            sql += ' ORDER BY IDORDER';
            values.push(parseInt(sortId))
        }
        if (typeof sortStatus === 'string') {
            sql += ' ORDER BY STATUSORDER';
            values.push(parseFloat(sortStatus))
        }
        else if (typeof sortCreateon === 'string') {
            sql += ' ORDER BY CREATEON';
            values.push(parseInt(sortCreateon))
        }
        //sort giảm dần
        if (sortFilter === 'down') {
            sql += ' DESC';
        }
    }
    const result = await db.query(sql, values);
    return result[0];

}
let getOrder = async (idUser) => {
    const result = await db.query('SELECT * FROM myorder where IDORDER = ?', [parseInt(idUser)]);

    return result[0];
}
let updateorder = async (statusorder, idorder) => {
    let values = [];
    let sql = "UPDATE myorder SET ";

    if (statusorder) {
        sql += "STATUSORDER = ? ";
        values.push(statusorder);
    }
    sql += "WHERE IDORDER = ?";
    values.push(parseInt(idorder));
    console.log(sql);
    let result;
    try {
        result = await db.query(sql, values);
    } catch (err) {
        return null;
    }
    //console.log(result);
    return result[0] && result.length > 0;
}
module.exports = {
    getAllOrder,
    getSortOrder,
    getOrder,
    updateorder

}