const db = require('../config/connectDB');

let getType = async (idProduct) => {
    const result = await db.query("SELECT m.IDTYPE, m.NAMETYPE FROM type m, product p WHERE p.IDTYPE = m.IDTYPE AND p.IDPRODUCT = ?", [parseInt(idProduct)]);
    return result[0][0];
}

module.exports = {
    getType
}