const db = require('../config/connectDB');

const creatOrder = async (idUser, idAddress, totalPrice) => {
    await db.query("INSERT myorder (IDUSER, IDADDRESS, STATUSORDER, TOTALPRICE) VALUES (?, ?, 'Đang chờ xác nhận', ?)", [idUser, idAddress, totalPrice]);
}
const addToProductOrder = async (idProduct, idOrder, amount) => {
    await db.query("INSERT product_order (IDPRODUCT, IDORDER, AMOUNT) VALUES (?, ?, ?)", [parseInt(idProduct), parseInt(idOrder), amount]);
}
const getLastestIdOrder = async (idUser) => {
    const result = await db.query("SELECT IDORDER FROM myorder WHERE IDUSER = ?", [parseInt(idUser)]);
    return result[0];
}
const getListAllOrdered = async(idUser) => {
    const result = await db.query("SELECT mo.IDORDER, pd.IDPRODUCT, pt.LINK, pd.NAMEPRODUCT, mo.STATUSORDER, pdo.AMOUNT, (SELECT PRICE * pdo.AMOUNT FROM product pd2 WHERE pd2.IDPRODUCT = pd.IDPRODUCT) as TOTALPRICE FROM product pd, product_order pdo, photo pt, myorder mo WHERE pd.IDPRODUCT = pdo.IDPRODUCT AND pd.IDPRODUCT = pt.IDPRODUCT AND pdo.IDORDER = mo.IDORDER AND IDUSER = ? GROUP BY mo.IDORDER, pd.IDPRODUCT HAVING COUNT(*) >= 1", [idUser]);
    return result[0];
}
const getListOrdered = async (idUser, idOrder) => {
    const result = await db.query("SELECT mo.IDORDER, pd.IDPRODUCT, pt.LINK, pd.NAMEPRODUCT, mo.STATUSORDER, pdo.AMOUNT, (SELECT PRICE * pdo.AMOUNT FROM product pd2 WHERE pd2.IDPRODUCT = pd.IDPRODUCT) as TOTALPRICE FROM product pd, product_order pdo, photo pt, myorder mo WHERE pd.IDPRODUCT = pdo.IDPRODUCT AND pd.IDPRODUCT = pt.IDPRODUCT AND pdo.IDORDER = mo.IDORDER ANd pdo.IDORDER = ? AND IDUSER = ? GROUP BY mo.IDORDER, pd.IDPRODUCT HAVING COUNT(*) >= 1", [idOrder, idUser]);
    return result[0];
}
const getListFilterAllOrdered = async (idUser, condition) => {
    const result = await db.query("SELECT mo.IDORDER, pd.IDPRODUCT, pt.LINK, pd.NAMEPRODUCT, mo.STATUSORDER, pdo.AMOUNT, (SELECT PRICE * pdo.AMOUNT FROM product pd2 WHERE pd2.IDPRODUCT = pd.IDPRODUCT) as TOTALPRICE FROM product pd, product_order pdo, photo pt, myorder mo WHERE pd.IDPRODUCT = pdo.IDPRODUCT AND pd.IDPRODUCT = pt.IDPRODUCT AND pdo.IDORDER = mo.IDORDER AND IDUSER = ? AND mo.STATUSORDER like ? GROUP BY mo.IDORDER, pd.IDPRODUCT HAVING COUNT(*) >= 1", [idUser, condition]);
    return result[0];
}

module.exports = {
    creatOrder,
    addToProductOrder,
    getLastestIdOrder,
    getListAllOrdered,
    getListOrdered,
    getListFilterAllOrdered
}