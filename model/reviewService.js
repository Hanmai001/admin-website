const db = require('../config/connectDB');

const getAllReview = async (id) => {
    const result = await db.query('SELECT rv.CONTENT, us.USERNAME, us.AVATAR FROM review rv JOIN user us ON us.IDUSER = rv.IDUSER WHERE rv.IDPRODUCT = ?', [parseInt(id)]);
    //console.log(result[0])
    return result[0];
}
const getReviewPage = async (id, offset, limit) => {
    const result = await db.query('SELECT * FROM (SELECT rv.CONTENT, us.USERNAME, us.AVATAR, rv.CREATEON FROM review rv JOIN user us ON us.IDUSER = rv.IDUSER WHERE rv.IDPRODUCT = ? ORDER BY rv.CREATEON DESC) a LIMIT ?, ?', [id, offset, limit]);
    return result[0];
}
const addReview = async (idProduct, idUser, content, time) => {
    await db.query('INSERT review (IDUSER, IDPRODUCT, CONTENT, CREATEON) value (?, ?, ?, ?)', [idUser, idProduct, content, time]);
}
module.exports = {
    getAllReview,
    getReviewPage,
    addReview
}