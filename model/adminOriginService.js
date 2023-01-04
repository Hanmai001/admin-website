const db = require('../config/connectDB');
const bcrypt = require('bcryptjs');

let getAllManufacturer = async () => {
    const result = await db.query('SELECT * FROM manufacturer');

    return result[0];
}
let getManufacturer = async (idUser) => {
    const result = await db.query('SELECT * FROM manufacturer where IDMANUFACTURER = ?', [parseInt(idUser)]);

    return result[0];
}
//SORT ORIGIN-MANAGE
let getSortManufacturer = async (queryFilter) => {
    const {
        sortType: sortType,
        sort: sortFilter
    } = queryFilter;
    let values = [];
    let sql = 'SELECT * FROM manufacturer';

    if (sortFilter && typeof sortFilter === 'string' && (sortType)) {
        //sort tăng dần
        if (typeof sortType === 'string') {
            sql += ' ORDER BY NAMEMANUFACTURER';
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
let updateorigin = async (data, idOrigin) => {
    const {
        updateNamemanufacturer: manufacturer
    } = data;
    let values = [];
    let sql = "UPDATE manufacturer SET ";
    // if (ava) {
    //     sql += " LINK = ? ";
    //     values.push(ava);
    //  }
    if (manufacturer) {
        // /*if (ava)*/ sql += ", ";
        sql += "NAMEMANUFACTURER = ? ";
        values.push(manufacturer);
    }
    sql += "WHERE IDMANUFACTURER = ?";
    values.push(parseInt(idOrigin));
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
let deleteOrigin = async (idType) => {

    let values = [];
    let sql = "DELETE FROM manufacturer WHERE IDMANUFACTURER = ? ";
    values.push(parseInt(idType));
    let result;
   // console.log(sql);
    try {
        result = await db.query(sql, values);
    } catch (err) {
        return null;
    }

    return result[0] && result.length > 0;
}
let addOrigin = async (data) => {
    const {
        addNameorigin: addNameorigin,
    } = data;
    let values = [];
    let sql = "INSERT INTO manufacturer (NAMEMANUFACTURER) VALUES (";
    // console.log(addNameorigin);

    if (addNameorigin) {
        sql += "?)";
        values.push(addNameorigin);
    }
    let result;
    console.log(sql);
    try {
        result = await db.query(sql, values);
    } catch (err) {
        return null;
    }

    return result[0] && result.length > 0;
}
module.exports = {
    getAllManufacturer,
    getSortManufacturer,
    getManufacturer,
    updateorigin,
    addOrigin,
    deleteOrigin
}