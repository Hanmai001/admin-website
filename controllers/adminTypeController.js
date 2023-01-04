const adminTypeService = require('../model/adminTypeService')
const authService = require('../model/authService')

let getTypeManage = async (req, res) => {
    const { AVATAR: ava } = await authService.getUserByID(res.locals.user.id);
    const getType = await adminTypeService.getAllType();
    //let listType = getType;

    let listType;
    const {
        sortType: sortType,
        sort: sortFilter

    } = req.query;

    if (sortType || sortFilter) {
        listType = await adminTypeService.getSortType(req.query);
    }
    else listType = getType;
    const originUrl = `?${req.baseUrl}`;
    return res.render('type-manage.ejs', { ava, listType: listType, originUrl: originUrl })
}
let getDetailsType = async (req, res) => {
    const { AVATAR: ava } = await authService.getUserByID(res.locals.user.id);
    let idUser = req.params.id;
    const details = await adminTypeService.getType(idUser);
    //console.log(details);

    return res.render('details-type.ejs', { ava, details: details })

}
let updateInformation = async (req, res) => {
    const idtype = req.params.id;
    const { NAMETYPE: nametype } = await adminTypeService.getType(idtype);

    const {
        updateNametype: new_nametype,
    } = req.body;

    //nsole.log(req.body)

    // if (new_phone.length > 11) {
    //     req.flash('updateProfileMsg', 'SĐT phải nhỏ hơn 12 kí tự.');
    //     return res.redirect(`/admin-profile/${idType}`);
    // }

    const result = await adminTypeService.updatetype(req.body, idtype)

    //console.log(res.locals.user); 
    if (result) {
        return res.redirect(`/manage/details-type/${idtype}`);
    }
    req.flash('updateProfileMsg', 'Kiểm tra lại thông tin cập nhật.');
    return res.redirect(`/manage/details-type/${idtype}`);
}
let getAddType = async (req, res) => {
    const { AVATAR: ava } = await authService.getUserByID(res.locals.user.id);

    return res.render('admin-add-type.ejs', { ava });
}
let deleteInformation = async (req, res) => {
    const idType = req.params.id;

    const result = await adminTypeService.deleteType(idType)

    if (result) {
        return res.redirect(`/type-manage`);
    }
    req.flash('updateProfileMsg', 'Kiểm tra lại thông tin cập nhật.');
    return res.redirect(`/type-manage`);
}
let addInformation = async (req, res) => {
    //const idProduct = req.params.id;
    //  const { NAMEPRODUCT: nameproduct, PRICE: price, NUMBUY: numbuy, STATUSPRODUCT: statusproduct, REMAIN: remain } = await adminProductService.getProduct(idProduct);

    const {
        addNametype: addNametype,
    } = req.body;

    // console.log(addNameproduct)

    // if (new_phone.length > 11) {
    //     req.flash('updateProfileMsg', 'SĐT phải nhỏ hơn 12 kí tự.');
    //     return res.redirect(`/admin-profile/${idProduct}`);
    // }
    const result = await adminTypeService.addType(req.body)
    //console.log(res.locals.user); 

    if (result) {
        return res.redirect(`/admin-add-type`);
    }
    req.flash('updateProfileMsg', 'Kiểm tra lại thông tin cập nhật.');
    return res.redirect(`/admin-add-type`);
}
module.exports = {
    getTypeManage,
    getDetailsType,
    updateInformation,
    getAddType,
    deleteInformation,
    addInformation
}