const express = require('express');
const router = express.Router();

const adminOrderController = require('../controllers/adminOrderController');
const authController = require('../controllers/authController');

//Khoi tao web router
const initOrderRoute = (app) => {
    router.use((req, res, next) => {
        res.locals.flashMessages = req.flash();
        next();
    });
    router.get('/orders-manage', authController.isLoggedAdmin, adminOrderController.getOrdersManage);
    router.get('/manage/details-order/:id', authController.isLoggedAdmin, adminOrderController.getDetailsOrder);
    router.post('/manage/details-order/:id/update-info', adminOrderController.updateOrderStatus);

    return app.use('/', router);
}

module.exports = initOrderRoute;

