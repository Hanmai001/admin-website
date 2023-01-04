const db = require('../config/connectDB');

const findAddress = async (idUser) => {
    const result = await db.query("SELECT IDADDRESS FROM address WHERE IDUSER = ?", [parseInt(idUser)]);
    return result[0][0] ? result[0][0].IDADDRESS : null;
}
const updateAddress = async (idUser, name, address, phone) => {
    const idAddress = await findAddress(idUser);
    //console.log(idAddress);
    if (idAddress) {
        await db.query("UPDATE address SET NAME = ?, ADDRESS = ?, PHONE = ? WHERE IDADDRESS = ?", [name, address, phone, parseInt(idAddress)]);
    }
    else {
        await db.query("INSERT address (IDUSER, NAME, PHONE, ADDRESS) VALUES (?, ?, ?, ?)", [parseInt(idUser), name, phone, address]);
    }
}
const getUserAddress = async (idUser) => {
    const result = await db.query("SELECT IDADDRESS, NAME, PHONE, ADDRESS FROM address WHERE IDUSER = ?", [parseInt(idUser)]);
    return result[0][0];
}


module.exports = {
    updateAddress,
    getUserAddress
}