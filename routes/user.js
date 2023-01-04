const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const appRoot = require('app-root-path');

const userController = require('../controllers/userController');
const authController = require('../controllers/authController');
const adminControllers = require('../controllers/adminControllers');
const adminUserController = require('../controllers/adminUserController');

//Middleware
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, appRoot + '/public/images');
    },

    // By default, multer removes file extensions so let's add them back
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});

//Ham để check file
const imageFilter = function (req, file, cb) {
    // Accept images only
    if (!file.originalname.match(/\.(jpg|JPG|jpeg|JPEG|png|PNG|gif|GIF)$/)) {
        req.fileValidationError = 'Only image files are allowed!';
        return cb(null, false);
    }
    cb(null, true);
};
const upload = multer({ storage: storage, fileFilter: imageFilter });

//Khoi tao web router
const initUserRoute = (app) => {
    router.use((req, res, next) => {
        res.locals.flashMessages = req.flash();
        next();
    });
    router.get('/', authController.isLoggedCustomer, userController.getHomepage);
    router.get('/static', authController.isLoggedAdmin, adminControllers.getHomePage);
    router.get('/admin-profile/:id', authController.isLoggedAdmin, adminControllers.getAdminProfile);
    router.get('/change-password-admin/:id', authController.isLoggedAdmin, adminControllers.getChangePassword)
    router.post('/admin-profile/:id/update-info', upload.single('update-ava'), adminControllers.updateInformation)
    router.get('/logout', authController.logout);
    router.post('/change-password-admin/:id/update-password', adminControllers.updatePassword);

    router.get('/users-manage', authController.isLoggedAdmin, adminUserController.getUsersManage);
    router.get('/manage/details-user/:id', authController.isLoggedAdmin, adminUserController.getDetailsUser);
    router.get('/users-manage/:id/ban', authController.isLoggedAdmin, adminUserController.banUser);
    router.get('/users-manage/:id/unban', authController.isLoggedAdmin, adminUserController.unbanUser);

    //Web của ta bđau = '/', truyền router vào
    return app.use('/', router);
}

module.exports = initUserRoute;

