const productService = require('../model/productService');
const authService = require('../model/authService');
const cartService = require('../model/cartService');
const Paginator = require("paginator");
const qs = require('qs');


const getPagination = (page, size) => {
    const limit = size ? +size : 10;
    const offset = page ? page * limit : 0;

    return { limit, offset };
};

let getHomepage = async (req, res) => {
    const paginator = new Paginator(10, 5);
    let ava = null, numProductInCart = null;
    if (res.locals.user) {
        const { AVATAR } = await authService.getUserByID(res.locals.user.id);
        if (AVATAR) ava = AVATAR;
        const idCart = await cartService.findCartUser(res.locals.user.id);
        numProductInCart = await cartService.numProductInCart(idCart);
    }
    let products, allProducts, pagination_info, length;
    const {
        name: nameFilter,
        type: typeFilter,
        brand: brandFilter,
        manufacturer: manufacturerFilter,
        priceFrom: priceFrom,
        priceTo: priceTo,
        numBuy: numBuy,
        sortPrice: sortPrice,
        timeCreate: timeCreate,
        sort: sortFilter,

    } = req.query;
    const {
        page, ...withoutPage
    } = req.query;

    let currentPage = req.query.page ? +req.query.page : 1;
    let random_names = [];
    allProducts = await productService.getAllProduct();
    length = allProducts.length;
    for (let i = 0; i < 6; i++) {
        let num = Math.floor(Math.random() * length);
        let check = true;
        for (let j = 0; j < random_names.length; j++) {
            if (random_names[j] && random_names[j] === allProducts[num].NAMEPRODUCT) {
                check = false
            }

        }
        if (check || random_names.length < 1) {
            random_names.push(allProducts[num].NAMEPRODUCT)
        }
        else i--
    }
    if (nameFilter || typeFilter || manufacturerFilter || brandFilter || priceFrom || priceTo || numBuy || sortPrice || timeCreate || sortFilter) {
        allProducts = await productService.getFilterProducts(req.query);
        length = allProducts.length;
        pagination_info = paginator.build(length, currentPage);
        if (currentPage < 1) currentPage = 1;
        else if (currentPage > pagination_info.total_pages) currentPage = pagination_info.total_pages;
        const { limit, offset } = getPagination(currentPage - 1, req.query.size);
        products = await productService.getFilterProductsPage(req.query, limit, offset);
    }

    else {
        pagination_info = paginator.build(length, currentPage);
        if (currentPage < 1) currentPage = 1;
        else if (currentPage > pagination_info.total_pages) currentPage = pagination_info.total_pages;
        const { limit, offset } = getPagination(currentPage - 1, req.query.size);
        products = await productService.getProductsPage(limit, offset);
    }

    const brands = await productService.getAllBrand();
    const manufacturers = await productService.getAllManufacturer();
    const types = await productService.getAllType();

    let iterator = (currentPage - 5) < 1 ? 1 : currentPage - 4;
    let endingLink = (iterator + 4) <= pagination_info.total_pages ? (iterator + 4) : currentPage + (pagination_info.total_pages - currentPage);

    const originUrl = `${req.baseUrl}?${qs.stringify(withoutPage)}`;
    //console.log("Render2...", qs.parse(originUrl))
    return res.render('home.ejs', {
        numProductInCart,
        ava,
        originUrl,
        products, brands, types, manufacturers, names: random_names, pagination_info, iterator, endingLink
    });
}
let handleForgotPassword = async (req, res) => {
    const { newPass, confPass } = req.body;
    console.log(req.body)
    if (!newPass || !confPass) {
        req.flash('resetPassMsg', 'Vui lòng nhập đủ thông tin.');
        return res.redirect(`/reset-password?iduser=${req.params.id}`);
    }
    if (newPass.length < 6 || confPass.length < 6) {
        req.flash('resetPassMsg', 'Mật khẩu phải ít nhất 6 ký tự.');
        return res.redirect(`/reset-password?iduser=${req.params.id}`);
    }
    if (newPass !== confPass) {
        req.flash('resetPassMsg', 'Xác nhận mật khẩu không trùng.');
        return res.redirect(`/reset-password?iduser=${req.params.id}`);
    }
    const result = await userService.updatePassword(req.body, req.params.id);
    if (result) {
        const result = await authService.getUserByID(req.params.id);
        req.login(result, function (err) {
            console.log(result)
            if (result.ADMIN === '1')
                res.redirect('/static');
            else
                res.redirect('/');
        });
    }
}
module.exports = {
    getHomepage,
    handleForgotPassword
}