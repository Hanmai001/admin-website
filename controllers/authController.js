const Ajv = require('ajv');
const addFormats = require('ajv-formats');
const authService = require('../model/authService');
const registerSchema = require('../schemas/register')

const ajv = new Ajv();
//Format cho schema
addFormats(ajv);

let isLoggedAdmin = async (req, res, next) => {
    if (req.isAuthenticated() && req.session.passport.user.admin == '1') {
        return next();
    } else {
        return res.send('Bạn không có quyền truy cập');
    }
}
let isLoggedCustomer = async (req, res, next) => {
    if (req.isAuthenticated() && req.session.passport.user.admin == '0') {
        return next();
    } else if (req.isUnauthenticated()) {
        return next();
    }
    else
        return res.send("Bạn đang là Admin trang web");
}
let isLogged = async (req, res, next) => {
    if (req.isAuthenticated() && req.session.passport.user.admin == '0') {
        return next();
    } else if (req.isUnauthenticated()) {
        req.flash('loginMessage', 'Vui lòng đăng nhập')
        return res.redirect('/');
    }
}
let checkRegister = async (req, res, next) => {
    
    if (!ajv.validate(registerSchema, req.body)) {
        req.flash('registerMessage', 'Vui lòng kiểm tra lại thông tin đăng kí')
        return res.redirect('/');
    }
    const { username, email, password, confirmPassword } = req.body;
    if (username.length < 6) {
        req.flash('registerMessage', 'Username phải có ít nhất 6 ký tự ')
        return res.redirect('/');
    }
    if (password.length < 6) {
        req.flash('registerMessage', 'Mật khẩu phải có ít nhất 6 ký tự ')
        return res.redirect('/');
    }
    if (password !== confirmPassword) {
        req.flash('registerMessage', 'Mật khẩu không trùng')
        return res.redirect('/');
    }
    if (!(/[a-z]/.test(password) && /[A-Z]/.test(password) && /[0-9]/.test(password))) {
        req.flash('registerMessage', 'Mật khẩu phải có ít nhất 1 kí tự thường, 1 kí tự hoa và số')
        return res.redirect('/');
    }
    next();
}
let handleRegister = async (req, res) => {
    const { username, email, pw } = req.query;
    const result = await authService.register(username, email, pw);
    req.login(result, function (err) {
        console.log(result)
        if (err) { return next(err); }
        return res.redirect('/');
    });
}
let logout = (req, res) => {
    req.logout(function (err) {
        if (err) {
            return next(err);
        }

        res.locals.user = null;
        console.log(res.locals.user)
        req.session.destroy();
        res.redirect('/');
    });
};



module.exports = {
    checkRegister,
    handleRegister,
    logout,
    isLoggedAdmin,
    isLoggedCustomer,
    isLogged
}