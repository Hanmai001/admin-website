const adminUserService = require('../../model/adminUserService');
const Paginator = require("paginator");

const getPagination = (page, size) => {
    const limit = size ? +size : 2;
    const offset = page ? page * limit : 0;

    return { limit, offset };
};
let getListUser = async (req, res) => {
    const paginator = new Paginator(2, 5);
    const {
        timeCreate: timeCreate,
        sortEmail: sortEmail,
        sortHoTen: sortName,
        sort: sortFilter

    } = req.query;
    const allUser = await adminUserService.getAllUser();
    let listUser = allUser;
    let pagination_info;
    let currentPage = req.query.page ? +req.query.page : 1;
    console.log(currentPage)
    let length = allUser.length;
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
    return res.status(200).json({ listUser: listUser, pagination_info, iterator, endingLink });
}
module.exports = {
    getListUser
}