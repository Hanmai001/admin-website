const db = require('../config/connectDB');
const productService = require('./productService');

const updateTotalPriceCart = async (idCart, price) => {
    const result = await db.query("UPDATE cart SET TOTALPRICE = ? WHERE IDCART = ?", [price, parseInt(idCart)]);
    //console.log(result[0]);
}
const addCartUser = async (idUser) => {
    await db.query("INSERT INTO cart (IDUSER, TOTALPRICE) VALUES (?, 0)", [idUser]);
}
const addProductCart = async (idCart, idProduct, amount) => {
    if (await findProductInCart(idCart, idProduct)) {
        await updateAmountProductInCart(idCart, idProduct, amount);
        await updatePriceProductInCart(idCart, idProduct, amount);
    }
    else {
        await db.query("INSERT INTO product_cart (IDCART, CHECKORDER, IDPRODUCT, AMOUNT) VALUES (?, '0', ?, ?)", [parseInt(idCart), parseInt(idProduct), parseInt(amount)]);
        await updatePriceProductInCart(idCart, idProduct, amount);
    }
}
const findCartUser = async (idUser) => {
    const result = await db.query("SELECT IDCART FROM cart WHERE IDUSER = ?", [idUser]);
    return result[0][0].IDCART;
}
const findProductInCart = async (idCart, idProduct) => {
    const result = await db.query("SELECT IDPRODUCT FROM product_cart WHERE IDCART = ? AND IDPRODUCT = ?", [parseInt(idCart), parseInt(idProduct)]);
    //console.log(result[0]);
    return result[0][0];
}
const updateAmountProductInCart = async (idCart, idProduct, amount) => {
    const result = await db.query("UPDATE product_cart SET AMOUNT = ? WHERE IDCART = ? AND IDPRODUCT = ?", [amount, parseInt(idCart), parseInt(idProduct)]);
}
const updatePriceProductInCart = async (idCart, idProduct, amount) => {
    const price = await productService.calProductsPrice(idProduct, amount);
    const result = await db.query("UPDATE product_cart SET PRICE = ? WHERE IDCART = ? AND IDPRODUCT = ?", [price, parseInt(idCart), parseInt(idProduct)]);
}
const calTotalPriceInCart = async (idCart) => {
    const result = await db.query("SELECT SUM(PRICE) as SUM FROM product_cart WHERE IDCART = ?", [parseInt(idCart)]);
    return result[0][0].SUM;
}
const calTotalPriceChosenProducts = async (idCart) => {
    const result = await db.query("SELECT SUM(PRICE) as SUM FROM product_cart WHERE CHECKORDER = '1' AND IDCART = ?", [parseInt(idCart)]);
    return result[0][0].SUM;
}
const numProductInCart = async (idCart) => {
    const result = await db.query("SELECT SUM(AMOUNT) as SUM FROM product_cart WHERE IDCART = ?", [parseInt(idCart)]);
    return result[0][0].SUM ? result[0][0].SUM : 0;
}
module.exports = {
    addCartUser,
    addProductCart,
    findCartUser,
    updateTotalPriceCart,
    calTotalPriceInCart,
    numProductInCart,
    calTotalPriceChosenProducts
}