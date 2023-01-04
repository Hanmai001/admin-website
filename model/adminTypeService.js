const db = require('../config/connectDB');
const bcrypt = require('bcryptjs');

let getAllType = async () => {
    const result = await db.query('select * from type');

    return result[0];
}

//SORT TYPE-MANAGE
let getSortType = async (queryFilter) => {
    const {
        sortType: sortType,
        sort: sortFilter
    } = queryFilter;
    let values = [];
    let sql = 'SELECT * FROM onlineshop.type';

    if (sortFilter && typeof sortFilter === 'string' && (sortType)) {
        //sort tăng dần
        if (typeof sortType === 'string') {
            sql += ' ORDER BY NAMETYPE';
            values.push(parseInt(sortType))
        }
        //sort giảm dần
        if (sortFilter === 'down') {
            sql += ' DESC';
        }
    }
    const result = await db.query(sql, values);
    return result[0];

}
let getType = async (idUser) => {
    const result = await db.query('SELECT * FROM type where IDTYPE = ?', [parseInt(idUser)]);

    return result[0];
}
let updatetype = async (data, idType) => {
    const {
        updateNametype: nametype
    } = data;
    let values = [];
    let sql = "UPDATE type SET ";
    // if (ava) {
    //     sql += " LINK = ? ";
    //     values.push(ava);
    //  }
    if (nametype) {
        // /*if (ava)*/ sql += ", ";
        sql += "NAMETYPE = ? ";
        values.push(nametype);
    }
    sql += "WHERE IDTYPE = ?";
    values.push(parseInt(idType));
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
let deleteType = async (idType) => {

    let values = [];
    let sql = "DELETE FROM type WHERE IDTYPE = ? ";
    values.push(parseInt(idType));
    let result;
    console.log(sql);
    try {
        result = await db.query(sql, values);
    } catch (err) {
        return null;
    }

    return result[0] && result.length > 0;
}
let addType = async (data) => {
    const {
        addNametype: addNametype,
    } = data;
    let values = [];
    let sql = "INSERT INTO type (NAMETYPE) VALUES (";
    // console.log(addNametype);

    if (addNametype) {
        sql += "?)";
        values.push(addNametype);
    }
    let result;
    // console.log(sql);
    try {
        result = await db.query(sql, values);
    } catch (err) {
        return null;
    }

    return result[0] && result.length > 0;
}
module.exports = {
    getAllType,
    getSortType,
    getType,
    updatetype,
    deleteType,
    addType
}
