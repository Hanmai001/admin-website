const adminProductService = require('../model/adminProductService')
const adminOriginService = require('../model/adminOriginService')
const adminTypeService = require('../model/adminTypeService')
const photoService = require('../model/photoService');

const brandService = require('../model/brandService');
const typeService = require('../model/typeService');
const manuService = require('../model/manuaService');
const materialService = require('../model/materialService');

const authService = require('../model/authService')
const Paginator = require("paginator");
const qs = require('qs');

const getPagination = (page, size) => {
    const limit = size ? +size : 5;
    const offset = page ? page * limit : 0;
    return { limit, offset };
};

let getProductManage = async (req, res) => {
    const paginator = new Paginator(5, 5);
    const { AVATAR: ava } = await authService.getUserByID(res.locals.user.id);
    //  let idProduct = req.params.id;
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
    const {
        page, ...withoutPage
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
    let iterator = (currentPage - 5) < 1 ? 1 : currentPage - 4;
    let endingLink = (iterator + 4) <= pagination_info.total_pages ? (iterator + 4) : currentPage + (pagination_info.total_pages - currentPage);
    let originUrl = `${req.baseUrl}?${qs.stringify(withoutPage)}`;
    originUrl = originUrl.replaceAll("&amp;", "&");

    return res.render('product-manage.ejs', { ava, listProduct, originUrl, pagination_info, iterator, endingLink })
}

let getDetailsProduct = async (req, res) => {
    const { AVATAR: ava } = await authService.getUserByID(res.locals.user.id);
    let idProduct = req.params.id;
    const details = await adminProductService.getProduct(idProduct);
    const origin = await adminOriginService.getAllManufacturer();
    const type = await adminTypeService.getAllType();
    const brand = await adminProductService.getAllBrand();
    const material = await adminProductService.getAllMaterial();

    const curOrigin = await manuService.getOrigin(idProduct);
    const curType = await typeService.getType(idProduct);
    const curBrand = await brandService.getBrand(idProduct);
    const curMaterial = await materialService.getMaterial(idProduct);

    return res.render('details-product.ejs', { curBrand, curMaterial, curOrigin, curType, ava, details: details, origin: origin, type: type, brand: brand, material: material })
}
let updateInformation = async (req, res) => {
    const idProduct = req.params.id;
    //const { NAMEPRODUCT: nameproduct, PRICE: price, NUMBUY: numbuy, STATUSPRODUCT: statusproduct, REMAIN: remain, LINK: link } = await adminProductService.getProduct(idProduct);
    let pics_product = [];
    const length = req.files.length;
    for (let i = 0; i < length; i++) {
        if (req.files[i]) {
            pics_product.push('/images/' + req.files[i].filename);
        }
    }
    console.log(pics_product)
    const {
        updatePrice,
        updateRemain
    } = req.body;
    if (updatePrice <= 0) {
        req.flash('updateProductMsg', 'Vui l??ng ??i???n gi?? ti???n ph?? h???p.');
        return res.redirect(`/manage/details-product/${idProduct}`);
    }
    if (updateRemain <= 0) {
        req.flash('updateProductMsg', 'Vui l??ng nh???p s??? l?????ng s???n ph???m hi???n c??.');
        return res.redirect(`/manage/details-product/${idProduct}`);
    }

    const result = await adminProductService.updateProduct(req.body, idProduct)
    //console.log(res.locals.user); 

    if (result) {
        await photoService.updatePhotos(pics_product, idProduct);
        return res.redirect(`/manage/details-product/${idProduct}`);
    }
    req.flash('updateProductMsg', 'Ki???m tra l???i th??ng tin c???p nh???t.');
    return res.redirect(`/manage/details-product/${idProduct}`);
}
let deleteInformation = async (req, res) => {
    const idProduct = req.params.id;

    const result = await adminProductService.deleteProduct(idProduct)

    if (result) {
        return res.redirect(`/product-manage`);
    }
    req.flash('updateProfileMsg', 'Ki???m tra l???i th??ng tin c???p nh???t.');
    return res.redirect(`/product-manage`);
}
let getAddProduct = async (req, res) => {
    const { AVATAR: ava } = await authService.getUserByID(res.locals.user.id);
    const origin = await adminOriginService.getAllManufacturer();
    const type = await adminTypeService.getAllType();
    const brand = await adminProductService.getAllBrand();
    const material = await adminProductService.getAllMaterial();



    return res.render('admin-add-product.ejs', { ava, origin: origin, type: type, brand: brand, material: material });
}
let addInformation = async (req, res) => {
    let pics_product = [];
    const length = req.files.length;
    for (let i = 0; i < length; i++) {
        if (req.files[i]) {
            pics_product.push('/images/' + req.files[i].filename);
        }
    }
    const {
        addNameproduct,
        addPrice,
        type,
        brand,
        manufacturer,
        material,
        status,
        expiry,
        remain
    } = req.body;
    if (!addNameproduct || !addPrice || !type || !brand || !manufacturer || !material || !status || !expiry || !remain) {
        req.flash('addProductMsg', 'Vui l??ng ??i???n ????? th??ng tin s???n ph???m.');
        return res.redirect(`/admin-add-product`);
    }
    if (addPrice <= 0) {
        req.flash('addProductMsg', 'Vui l??ng ??i???n gi?? ti???n ph?? h???p.');
        return res.redirect(`/admin-add-product`);
    }
    if (remain <= 0) {
        req.flash('addProductMsg', 'Vui l??ng nh???p s??? l?????ng s???n ph???m hi???n c??.');
        return res.redirect(`/admin-add-product`);
    }
    const result = await adminProductService.addProduct(req.body)
    console.log(result)
    if (result) {
        await photoService.addPhotos(pics_product, result);
        return res.redirect(`/admin-add-product`);
    }
    req.flash('addProductMsg', 'Th??m s???n ph???m th???t b???i');
    return res.redirect(`/admin-add-product`);
}
module.exports = {
    getProductManage,
    getDetailsProduct,
    updateInformation,
    deleteInformation,
    getAddProduct,
    addInformation
}