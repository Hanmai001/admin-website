const productService = require('../../model/productService');
const adminProductService = require('../../model/adminProductService')
const cartService = require('../../model/cartService');
const Paginator = require("paginator");

const getPagination = (page, size) => {
    const limit = size ? +size : 5;
    const offset = page ? page * limit : 0;

    return { limit, offset };
};
const updateProductPriceInListOrder = async (req, res) => {
    const { idProduct, amount } = req.query;
    //console.log(idProduct, amount)
    const result = await productService.calProductsPrice(idProduct, amount);
    res.status(200).json(result);
}
const updateProductInPayment = async (req, res) => {
    const { idProduct, checkOrder } = req.query;
    const idCart = await cartService.findCartUser(res.locals.user.id);
    await productService.updateCheckOrder(idProduct, idCart, checkOrder);

    const { totalAmount, totalPrice } = await updateTotalOrder(idCart);
    res.status(200).json({ totalAmount: totalAmount ? totalAmount : 0, totalPrice: totalPrice ? totalPrice : 0 });
}
const updateTotalOrder = async (idCart) => {
    let totalAmount, totalPrice;
    const result = await productService.getChosenOrderTotal(idCart);

    if (result) {
        totalAmount = result.TOTALAMOUNT;
        totalPrice = result.TOTALPRICE;
    }
    return { totalAmount, totalPrice };
}
const deleteItemInCart = async (req, res) => {
    const { id } = req.params;
    const idCart = await cartService.findCartUser(res.locals.user.id);
    await productService.deleteFromCart(idCart, id);
    res.status(200).json(true);
}


const getListProduct = async (req, res) => {
    const paginator = new Paginator(5, 5);
    const allProduct = await adminProductService.getAllProduct();
    let listProduct = allProduct;
    let pagination_info;
    let currentPage = req.query.page ? +req.query.page : 1;
    let length = allProduct.length;
    const {
        sortName: sortName,
        sortType: sortType,
        sortNumbuy: sortNumbuy,
        sortCreateon: sortCreateon,
        sort: sortFilter

    } = req.query;
    if (sortName || sortType || sortNumbuy || sortCreateon || sortFilter) {
        listProduct = await adminProductService.getSortProduct(req.query);
        length = listProduct.length;
        pagination_info = paginator.build(length, currentPage);
        if (currentPage < 1) currentPage = 1;
        else if (currentPage > pagination_info.total_pages) currentPage = pagination_info.total_pages;
        const { limit, offset } = getPagination(currentPage - 1, req.query.size);
        listProduct = await adminProductService.getSortProductPage(req.query, offset, limit);
    }
    else {
        pagination_info = paginator.build(length, currentPage);
        if (currentPage < 1) currentPage = 1;
        else if (currentPage > pagination_info.total_pages) currentPage = pagination_info.total_pages;
        const { limit, offset } = getPagination(currentPage - 1, req.query.size);
        listProduct = await adminProductService.getProductPage(offset, limit);
    }
    //console.log(listProduct)
    let iterator = (currentPage - 5) < 1 ? 1 : currentPage - 4;
    let endingLink = (iterator + 4) <= pagination_info.total_pages ? (iterator + 4) : currentPage + (pagination_info.total_pages - currentPage);
    return res.status(200).json({ listProduct, pagination_info, iterator, endingLink });
}

module.exports = {
    updateProductPriceInListOrder,
    updateProductInPayment,
    deleteItemInCart,
    getListProduct
}