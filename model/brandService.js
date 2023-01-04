const db = require('../config/connectDB');

let getBrand = async (idProduct) => {
    const result = await db.query("SELECT m.IDBRAND, m.NAMEBRAND FROM BRAND m, product p WHERE p.IDBRAND = m.IDBRAND AND p.IDPRODUCT = ?", [parseInt(idProduct)]);
    return result[0][0];
}

module.exports = {
    getBrand
}