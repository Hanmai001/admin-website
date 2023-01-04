const db = require('../config/connectDB');

let getMaterial = async (idProduct) => {
    const result = await db.query("SELECT m.IDMATERIAL, m.NAMEMATERIAL FROM MATERIAL m, product p WHERE p.IDMATERIAL = m.IDMATERIAL AND p.IDPRODUCT = ?", [parseInt(idProduct)]);
    return result[0][0];
}

module.exports = {
    getMaterial
}