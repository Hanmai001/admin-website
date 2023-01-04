const db = require('../config/connectDB');

let getProduct = async (idUser) => {
    const result = await db.query('SELECT * FROM product pd JOIN photo pt ON pt.IDPRODUCT = pd.IDPRODUCT JOIN brand br ON br.IDBRAND = pd.IDBRAND JOIN manufacturer manu ON manu.IDMANUFACTURER = pd.IDMANUFACTURER JOIN material mt ON mt.IDMATERIAL = pd.IDMATERIAL WHERE pd.IDPRODUCT = ?', [parseInt(idUser)]);
    //console.log(result);
    return result[0];
}
// let getProductByID = async (id) => {
//     const result = await db.query('select pd.NAMEPRODUCT, pd.PRICE, pd.EXPIRY, pd.NUMBUY, pd.STATUSPRODUCT, pd.REMAIN, pt.LINK from product pd join photo pt on pt.IDPRODUCT = pd.IDPRODUCT where pd.IDPRODUCT = ?', [id]);
//     return result[0][0];
// };
let getAllProduct = async () => {
    const result = await db.query('SELECT pd.IDPRODUCT,pd.NAMEPRODUCT, tp.NAMETYPE, pd.CREATEON, pd.PRICE, pd.NUMBUY FROM product pd JOIN type tp on tp.IDTYPE = pd.IDTYPE');
    //console.log(result);
    return result[0];
}
let getAllBrand = async () => {
    const result = await db.query('SELECT * from brand');
    //console.log(result);
    return result[0];
}
let getAllMaterial = async () => {
    const result = await db.query('SELECT * from material');
    //console.log(result);
    return result[0];
}
let updateProduct = async (data, idProduct) => {
    const {
        updateNameproduct,
        updatePrice,
        updateType,
        updateBrand,
        updateOrigin,
        updateMaterial,
        updateStatus,
        updateExpiry,
        updateRemain
    } = data;
    //console.log(data);
    let values = [];
    let sql = "UPDATE product SET ";

    if (updateNameproduct) {
        sql += "NAMEPRODUCT = ?";
        values.push(updateNameproduct);
    }
    if (updatePrice) {
        if (updateNameproduct) sql += ", ";
        sql += "PRICE = ?";
        values.push(parseFloat(updatePrice));
    }
    if (updateType) {
        if (updateNameproduct || updatePrice) sql += ", ";
        sql += "IDTYPE = ?";
        values.push(parseInt(updateType));
    }
    if (updateBrand) {
        if (updateNameproduct || updatePrice || updateType) sql += ", ";
        sql += "IDBRAND = ?";
        values.push(parseInt(updateBrand));
    }
    if (updateOrigin) {
        if (updateNameproduct || updatePrice || updateType || brand) sql += ", ";
        sql += "IDMANUFACTURER = ?";
        values.push(parseInt(updateOrigin));
    }
    if (updateMaterial) {
        if (updateNameproduct || updatePrice || updateType || updateBrand || updateOrigin) sql += ", ";
        sql += "IDMATERIAL = ?";
        values.push(parseInt(updateMaterial));
    }
    if (updateStatus) {
        if (updateNameproduct || updatePrice || updateType || updateBrand || updateOrigin || updateMaterial) sql += ", ";
        sql += "STATUSPRODUCT = ?";
        if (updateStatus === "out")
            values.push('Hết hàng');
        else if (updateStatus === "available")
            values.push('Còn hàng');
        else if (updateStatus === "suspend")
            values.push('Tạm ngưng');
    }
    if (updateExpiry) {
        if (updateNameproduct || updatePrice || updateType || updateBrand || updateOrigin || updateMaterial || updateStatus) sql += ", ";
        sql += "EXPIRY = ?";
        values.push(updateExpiry);
    }
    if (updateRemain) {
        if (updateNameproduct || updatePrice || updateType || updateBrand || updateOrigin || updateMaterial || updateStatus || updateExpiry) sql += ", ";
        sql += "REMAIN = ?";
        values.push(parseInt(updateRemain));
    }
    sql += ' WHERE IDPRODUCT = ?';
    values.push(parseInt(idProduct));
    let result;
    console.log(sql);
    try {
        result = await db.query(sql, values);
    } catch (err) {
        return null;
    }

    return result[0] && result.length > 0;
}
let deleteProduct = async (idProduct) => {

    let values = [];
    let sql = "DELETE FROM product WHERE IDPRODUCT = ? ";
    values.push(parseInt(idProduct));
    let result;
    console.log(sql);
    try {
        result = await db.query(sql, values);
    } catch (err) {
        return null;
    }

    return result[0] && result.length > 0;
}
//SORT PRODUCT-MANAGE
let getSortProductPage = async (queryFilter, offset, limit) => {
    const {
        sortName: sortName,
        sortType: sortType,
        sortNumbuy: sortNumbuy,
        sortCreateon: sortCreateon,
        sort: sortFilter
    } = queryFilter;
    let values = [];
    let sql = 'SELECT pd.IDPRODUCT,pd.NAMEPRODUCT, tp.NAMETYPE, pd.CREATEON, pd.PRICE, pd.NUMBUY FROM onlineshop.product pd JOIN onlineshop.type tp on tp.IDTYPE = pd.IDTYPE';

    if (sortFilter && typeof sortFilter === 'string' && (sortName || sortType || sortNumbuy || sortCreateon)) {
        //sort tăng dần
        if (typeof sortName === 'string') {
            sql += ' ORDER BY pd.NAMEPRODUCT';
        }
        if (typeof sortType === 'string') {
            sql += ' ORDER BY tp.NAMETYPE';
        }
        if (typeof sortNumbuy === 'string') {
            sql += ' ORDER BY pd.NUMBUY';
        }
        else if (typeof sortCreateon === 'string') {
            sql += ' ORDER BY pd.CREATEON';
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
let getSortProduct = async (queryFilter) => {
    const {
        sortName: sortName,
        sortType: sortType,
        sortNumbuy: sortNumbuy,
        sortCreateon: sortCreateon,
        sort: sortFilter
    } = queryFilter;
    let values = [];
    let sql = 'SELECT pd.IDPRODUCT,pd.NAMEPRODUCT, tp.NAMETYPE, pd.CREATEON, pd.PRICE, pd.NUMBUY FROM onlineshop.product pd JOIN onlineshop.type tp on tp.IDTYPE = pd.IDTYPE';

    if (sortFilter && typeof sortFilter === 'string' && (sortName || sortType || sortNumbuy || sortCreateon)) {
        //sort tăng dần
        if (typeof sortName === 'string') {
            sql += ' ORDER BY pd.NAMEPRODUCT';
        }
        if (typeof sortType === 'string') {
            sql += ' ORDER BY tp.NAMETYPE';

        }
        if (typeof sortNumbuy === 'string') {
            sql += ' ORDER BY pd.NUMBUY';
        }
        else if (typeof sortCreateon === 'string') {
            sql += ' ORDER BY pd.CREATEON';

        }
        //sort giảm dần
        if (sortFilter === 'down') {
            sql += ' DESC';
        }
    }
    const result = await db.query(sql, values);
    return result[0];
}
let getProductPage = async (offset, limit) => {
    const result = await db.query('SELECT pd.IDPRODUCT,pd.NAMEPRODUCT, tp.NAMETYPE, pd.CREATEON, pd.PRICE, pd.NUMBUY FROM product pd JOIN type tp on tp.IDTYPE = pd.IDTYPE LIMIT ?, ?', [offset, limit]);
    //console.log(result);
    return result[0];
}
let addProduct = async (data) => {
    const {
        addNameproduct,
        addPrice,
        type,
        brand,
        manufacturer,
        material,
        status,
        expiry,
        remain
    } = data;
    let values = [];
    let sql = "INSERT INTO product (NUMBUY, NAMEPRODUCT, PRICE, IDTYPE, IDBRAND, IDMANUFACTURER, IDMATERIAL, STATUSPRODUCT, EXPIRY, REMAIN) VALUES (0, ";

    if (addNameproduct) {
        sql += "?";
        values.push(addNameproduct);
    }
    if (addPrice) {
        if (addNameproduct) sql += ", ";
        sql += "?";
        values.push(parseFloat(addPrice));
    }
    if (type) {
        if (addNameproduct || addPrice) sql += ", ";
        sql += "?";
        values.push(parseInt(type));
    }
    else values.push(null);
    if (brand) {
        if (addNameproduct || addPrice || type) sql += ", ";
        sql += "?";
        values.push(parseInt(brand));
    }
    else values.push(null);
    if (manufacturer) {
        if (addNameproduct || addPrice || type || brand) sql += ", ";
        sql += "?";
        values.push(parseInt(manufacturer));
    }
    else values.push(null);
    if (material) {
        if (addNameproduct || addPrice || type || brand || manufacturer) sql += ", ";
        sql += "?";
        values.push(parseInt(material));
    }
    else values.push(null);
    if (status) {
        if (addNameproduct || addPrice || type || brand || manufacturer || material) sql += ", ";
        sql += "?";
        if (status === "out")
            values.push('Hết hàng');
        else if (status === "available")
            values.push('Còn hàng');
        else if (status === "suspend")
            values.push('Tạm ngưng');
    }
    if (expiry) {
        if (addNameproduct || addPrice || type || brand || manufacturer || material || status) sql += ", ";
        sql += "?";
        values.push(expiry);
    }
    if (remain) {
        if (addNameproduct || addPrice || type || brand || manufacturer || material || status || expiry) sql += ", ";
        sql += "?";
        values.push(parseInt(remain));
    }
    else values.push(null);
    sql += ')';
    let result;
    console.log(sql, values);
    try {
        result = await db.query(sql, values);
    } catch (err) {
        return null;
    }
    return result[0].insertId;
}
module.exports = {
    getAllProduct,
    getProduct,
    getSortProduct,
    updateProduct,
    deleteProduct,
    getSortProductPage,
    getProductPage,
    addProduct,
    getAllBrand,
    getAllMaterial
    // getProductByID
}