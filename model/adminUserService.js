const db = require('../config/connectDB');
const bcrypt = require('bcryptjs');

let getUser = async (idUser) => {
    const result = await db.query('SELECT * FROM user us where IDUSER = ?', [parseInt(idUser)]);
    //console.log(result);
    return result[0];
}
let getAllUser = async () => {
    const result = await db.query('SELECT * FROM user us')
    //console.log(result);
    return result[0];
}
const getUserPage = async (offset, limit) => {
    const result = await db.query("SELECT * FROM user us LIMIT ?, ?", [offset, limit]);
    return result[0];
}
//SORT USER-MANAGE
let getSortUser = async (queryFilter) => {
    const {
        timeCreate: timeCreate,
        sortEmail: sortEmail,
        sortName: sortName,
        sort: sortFilter
    } = queryFilter;
    let values = [];
    let sql = 'SELECT * FROM onlineshop.user';

    if (sortFilter && typeof sortFilter === 'string' && (timeCreate || sortEmail || sortName)) {
        //sort tăng dần
        if (typeof timeCreate === 'string') {
            sql += ' ORDER BY CREATEON';
        }
        if (typeof sortEmail === 'string') {
            sql += ' ORDER BY EMAIL';
        }
        else if (typeof sortName === 'string') {
            sql += ' ORDER BY USERNAME';
        }
        //sort giảm dần
        if (sortFilter === 'down') {
            sql += ' DESC';
        }
    }
    const result = await db.query(sql, values);
    return result[0];

}
let ban = async (idUser) => {
    let values = [];
    let sql = "UPDATE user SET BAN = '1' WHERE IDUSER = ?";
    values.push(parseInt(idUser));
    let result;
    console.log(sql);
    try {
        result = await db.query(sql, values);
    } catch (err) {
        return null;
    }

    return result[0] && result.length > 0;
}
let unban = async (idUser) => {
    let values = [];
    let sql = "UPDATE user SET BAN = '0' WHERE IDUSER = ?";
    values.push(parseInt(idUser));
    let result;
    console.log(sql);
    try {
        result = await db.query(sql, values);
    } catch (err) {
        return null;
    }

    return result[0] && result.length > 0;
}
let getSortUserPage = async (queryFilter, offset, limit) => {
    const {
        timeCreate: timeCreate,
        sortEmail: sortEmail,
        sortName: sortName,
        sort: sortFilter
    } = queryFilter;
    console.log(queryFilter)
    let values = [];
    let sql = 'SELECT * FROM onlineshop.user';

    if (sortFilter && typeof sortFilter === 'string' && (timeCreate || sortEmail || sortName)) {
        //sort tăng dần
        if (typeof timeCreate === 'string') {
            sql += ' ORDER BY CREATEON';
        }
        if (typeof sortEmail === 'string') {
            sql += ' ORDER BY EMAIL';
        }
        else if (typeof sortName === 'string') {
            sql += ' ORDER BY USERNAME';
        }
        //sort giảm dần
        if (sortFilter === 'down') {
            sql += ' DESC';
        }
    }
    sql += ' LIMIT ?, ?';
    values.push(offset);
    values.push(limit);
    const result = await db.query(sql, values);
    return result[0];
}
module.exports = {
    getAllUser,
    getUser,
    getSortUser,
    ban,
    unban,
    getUserPage,
    getSortUserPage
}