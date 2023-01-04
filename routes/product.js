const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const appRoot = require('app-root-path');

const productController = require('../controllers/productController');
const adminProductController = require('../controllers/adminProductController');
const authController = require('../controllers/authController');
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
const initProductRoute = (app) => {
    router.use((req, res, next) => {
        res.locals.flashMessages = req.flash();
        next();
    });
    router.get('/products/details/:id', authController.isLoggedCustomer, productController.getDetailProductPage);
    router.get('/product-manage', authController.isLoggedAdmin, adminProductController.getProductManage);
    router.get('/manage/details-product/:id', authController.isLoggedAdmin, adminProductController.getDetailsProduct);
    router.post('/manage/details-product/:id/update-info', upload.array('updateLink', 4), adminProductController.updateInformation);
    router.get('/product-manage/:id/delete-info', authController.isLoggedAdmin, adminProductController.deleteInformation);
    router.get('/admin-add-product', authController.isLoggedAdmin, adminProductController.getAddProduct);
    router.post('/admin-add-product/add-product', authController.isLoggedAdmin, upload.array('update-pic-product', 4), adminProductController.addInformation);

    return app.use('/', router);
}

module.exports = initProductRoute;

