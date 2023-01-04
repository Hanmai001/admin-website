const adminUserService = require('../model/adminUserService')
const authService = require('../model/authService')
const Paginator = require("paginator");
const qs = require('qs');

const getPagination = (page, size) => {
    const limit = size ? +size : 2;
    const offset = page ? page * limit : 0;
    return { limit, offset };
};

//SORT USER-MANAGE
let getUsersManage = async (req, res) => {
    const paginator = new Paginator(2, 5);
    const { AVATAR: ava } = await authService.getUserByID(res.locals.user.id);

    const allUser = await adminUserService.getAllUser();
    //console.log(list.length);
    let listUser = allUser;
    let pagination_info;
    let currentPage = req.query.page ? +req.query.page : 1;
    let length = allUser.length;
    const {
        timeCreate: timeCreate,
        sortEmail: sortEmail,
        sortHoTen: sortName,
        sort: sortFilter

    } = req.query;
    const {
        page, ...withoutPage
    } = req.query;
    if (timeCreate || sortEmail || sortName || sortFilter) {
        listUser = await adminUserService.getSortUser(req.query);
        length = listUser.length;
        pagination_info = paginator.build(length, currentPage);
        if (currentPage < 1) currentPage = 1;
        else if (currentPage > pagination_info.total_pages) currentPage = pagination_info.total_pages;
        const { limit, offset } = getPagination(currentPage - 1, req.query.size);
        listUser = await adminUserService.getSortUserPage(req.query, offset, limit);
    }
    else {
        pagination_info = paginator.build(length, currentPage);
        if (currentPage < 1) currentPage = 1;
        else if (currentPage > pagination_info.total_pages) currentPage = pagination_info.total_pages;
        const { limit, offset } = getPagination(currentPage - 1, req.query.size);
        listUser = await adminUserService.getUserPage(offset, limit);
    }
    let iterator = (currentPage - 5) < 1 ? 1 : currentPage - 4;
    let endingLink = (iterator + 4) <= pagination_info.total_pages ? (iterator + 4) : currentPage + (pagination_info.total_pages - currentPage);
    let originUrl = `${req.baseUrl}?${qs.stringify(withoutPage)}`;
    originUrl = originUrl.replaceAll("&amp;", "&");

    return res.render('users-manage.ejs', { listUser: listUser, ava: ava, originUrl: originUrl, pagination_info, iterator, endingLink });
}

let getDetailsUser = async (req, res) => {
    const { AVATAR: ava } = await authService.getUserByID(res.locals.user.id);
    let idUser = req.params.id;
    const details = await adminUserService.getUser(idUser);

    //console.log(details);

    return res.render('details-user.ejs', { ava, details: details })
}
let banUser = async (req, res) => {
    const idUser = req.params.id;

    const result = await adminUserService.ban(idUser);

    if (result) {
        return res.redirect(`/users-manage`);
    }
    return res.redirect(`/users-manage`);
}
let unbanUser = async (req, res) => {
    const idUser = req.params.id;

    const result = await adminUserService.unban(idUser);

    if (result) {
        return res.redirect(`/users-manage`);
    }
    req.flash('updateProfileMsg', 'Kiểm tra lại thông tin cập nhật.');
    return res.redirect(`/users-manage`);
}
module.exports = {
    getUsersManage,
    getDetailsUser,
    banUser,
    unbanUser

}