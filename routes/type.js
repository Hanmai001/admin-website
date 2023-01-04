const express = require('express');
const router = express.Router();

const adminTypeController = require('../controllers/adminTypeController');
const authController = require('../controllers/authController');

const initAdminTypeRoute = (app) => {
    router.get('/type-manage', authController.isLoggedAdmin, adminTypeController.getTypeManage);
    router.get('/manage/details-type/:id', authController.isLoggedAdmin, adminTypeController.getDetailsType);
    router.post('/manage/details-type/:id/update-info', adminTypeController.updateInformation);
    router.get('/admin-add-type', authController.isLoggedAdmin, adminTypeController.getAddType);
    router.get('/type-manage/:id/delete-type', authController.isLoggedAdmin, adminTypeController.deleteInformation);
    router.post('/admin-add-type/add-type', authController.isLoggedAdmin, adminTypeController.addInformation);

    return app.use('/', router)
}

module.exports = initAdminTypeRoute;