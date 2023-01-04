const express = require('express');
const router = express.Router();

const adminOriginController = require('../controllers/adminOriginController');
const authController = require('../controllers/authController');

const initAdminOriginRoute = (app) => {
    router.get('/origin-manage', authController.isLoggedAdmin, adminOriginController.getOriginManage);
    router.get('/manage/details-origin/:id', authController.isLoggedAdmin, adminOriginController.getDetailsOrigin);
    router.post('/manage/details-origin/:id/update-info', adminOriginController.updateInformation);
    router.get('/admin-add-origin', authController.isLoggedAdmin, adminOriginController.getAddOrigin);
    router.get('/origin-manage/:id/delete-origin', authController.isLoggedAdmin, adminOriginController.deleteInformation);
    router.post('/admin-add-origin/add-origin', authController.isLoggedAdmin, adminOriginController.addInformation);

    return app.use('/', router)
}

module.exports = initAdminOriginRoute;