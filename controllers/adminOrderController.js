const adminOrderService = require('../model/adminOrderService')
const authService = require('../model/authService')

let getOrdersManage = async (req, res) => {
    const { AVATAR: ava } = await authService.getUserByID(res.locals.user.id);
    const getOrder = await adminOrderService.getAllOrder();
    //let listOrder = getOrder;
    //console.log(listOrder);
    let listOrder;
    const {
        sortId: sortId,
        sortStatus: sortStatus,
        sortCreateon: sortCreateon,
        sort: sortFilter
    } = req.query;

    if (sortId || sortStatus || sortCreateon || sortFilter) {
        listOrder = await adminOrderService.getSortOrder(req.query);
    }
    else listOrder = getOrder;
    const originUrl = `?${req.baseUrl}`;
    return res.render('orders-manage.ejs', { ava, listOrder: listOrder, originUrl: originUrl })
}
let getDetailsOrder = async (req, res) => {
    const { AVATAR: ava } = await authService.getUserByID(res.locals.user.id);
    let idUser = req.params.id;

    const details = await adminOrderService.getOrder(idUser);
    return res.render('details-order.ejs', { ava, details: details })
}
let updateOrderStatus = async (req, res) => {
    const idOrder = req.params.id;
    const { STATUSORDER: statusorder } = await adminOrderService.getOrder(idOrder);

    const {
        updateStatusorder,
    } = req.body;
    const result = await adminOrderService.updateorder(updateStatusorder, idOrder)
    if (result) {
        return res.redirect(`/manage/details-order/${idOrder}`);
    }
    return res.redirect(`/manage/details-order/${idOrder}`);
}
module.exports = {
    getOrdersManage,
    getDetailsOrder,
    updateOrderStatus
}