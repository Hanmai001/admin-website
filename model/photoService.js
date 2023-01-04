const db = require('../config/connectDB');

const addPhotos = async (pics_product, idProduct) => {
    const length = pics_product.length;
    for (let i = 0; i < length; i++)
        await db.query("INSERT INTO photo (IDPRODUCT, LINK) VALUES (?, ?)", [parseInt(idProduct), pics_product[i]]);
}
const getPhotos = async (idProduct) => {
    const result = await db.query("SELECT IDPHOTO FROM photo WHERE IDPRODUCT = ?", [parseInt(idProduct)]);
    return result[0];
}
const updatePhotos = async (pics_product, idProduct) => {
    const oldPhotos = await getPhotos(idProduct);
    const oldLength = oldPhotos.length;
    const length = pics_product.length;
    for (let i = 0; i < length; i++) {
        await db.query("UPDATE photo SET LINK = ? WHERE IDPHOTO = ?", [pics_product[i], oldPhotos[i].IDPHOTO]);
    }
        
}

module.exports = {
    addPhotos,
    updatePhotos
}