const db = require('../config/connectDB');

let getOrigin = async (idProduct) => {
    const result = await db.query("SELECT m.IDMANUFACTURER, m.NAMEMANUFACTURER FROM manufacturer m, product p WHERE p.IDMANUFACTURER = m.IDMANUFACTURER AND p.IDPRODUCT = ?", [parseInt(idProduct)]);
    return result[0][0];
}

module.exports = {
    getOrigin
}