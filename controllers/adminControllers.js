const adminService = require('../model/adminService')
const authService = require('../model/authService')

let getHomePage = async (req, res) => {
    const { AVATAR: ava } = await authService.getUserByID(res.locals.user.id);

    //all
    const revenue1 = await adminService.caculateRevenue1();
    const revenue2 = await adminService.caculateRevenue2();
    const revenue3 = await adminService.caculateRevenue3();
    const revenue4 = await adminService.caculateRevenue4();
    //day 
    const revenueday1 = await adminService.caculateRevenueday1();
    const revenueday2 = await adminService.caculateRevenueday2();
    const revenueday3 = await adminService.caculateRevenueday3();
    const revenueday4 = await adminService.caculateRevenueday4();
    const sales = await adminService.caculateProduct();
    const salesDay = await adminService.caculateProductDay();
    const salesMonth = await adminService.caculateProductMonth();
    console.log(salesDay);

    return res.render('index.ejs', {
        ava, revenue1: revenue1, revenue2: revenue2, revenue3: revenue3, revenue4: revenue4, sales: sales,
        revenueday1: revenueday1, revenueday2: revenueday2, revenueday3: revenueday3, revenueday4: revenueday4, salesDay: salesDay, salesMonth: salesMonth
    });
}
let getAdminProfile = async (req, res) => {
    const { EMAIL: email, FULLNAME: fullname, SEX: sex, PHONE: phone, AVATAR: ava } = await authService.getUserByID(res.locals.user.id);
    //console.log({ email, fullname, sex, phone, ava })
    return res.render('admin-profile.ejs', { email, fullname, sex, phone, ava });
}
let getChangePassword = async (req, res) => {
    const { AVATAR: ava } = await authService.getUserByID(res.locals.user.id);
    return res.render('change-password-admin.ejs', { ava })
}
let updateInformation = async (req, res) => {
    const idUser = req.params.id;
    const { EMAIL: email, FULLNAME: fullname, SEX: sex, PHONE: phone, AVATAR: ava } = await authService.getUserByID(idUser);
    let new_ava = ava;
    if (req.file) {
        new_ava = '/images/' + req.file.filename;
    }
    const {
        updateFullname: new_fullname,
        updateEmail: new_email,
        updatePhone: new_phone,
        updateSex: new_sex
    } = req.body;

    //console.log(req.body)

    if (new_phone.length > 11) {
        req.flash('updateProfileMsg', 'SĐT phải nhỏ hơn 12 kí tự.');
        return res.redirect(`/admin-profile/${idUser}`);
    }

    const result = await adminService.updateProfile(req.body, new_ava, idUser);
    //console.log(res.locals.user); 
    if (result) {
        return res.redirect(`/admin-profile/${idUser}`);
    }
    req.flash('updateProfileMsg', 'Kiểm tra lại thông tin cập nhật.');
    return res.redirect(`/admin-profile/${idUser}`);

}
let updatePassword = async (req, res) => {
    const {
        curPass,
        newPass,
        confPass
    } = req.body;
    const idUser = req.params.id;
    if (!curPass || !newPass || !confPass) {
        req.flash('updatePassMsg', 'Vui lòng nhập đủ thông tin.');
        return res.redirect(`/change-password-admin/${idUser}`);
    }
    if (curPass.length < 6 || newPass.length < 6 || confPass.length < 6) {
        req.flash('updatePassMsg', 'Mật khẩu phải ít nhất 6 ký tự.');
        return res.redirect(`/change-password-admin/${idUser}`);
    }
    if (newPass !== confPass) {
        req.flash('updatePassMsg', 'Xác nhận mật khẩu không trùng.');
        return res.redirect(`/change-password-admin/${idUser}`);
    }
    //console.log(res.locals.user.username);
    if (!await authService.checkUserCredential(res.locals.user.username, curPass)) {
        //console.log("sai mk");
        req.flash('updatePassMsg', 'Nhập sai mật khẩu hiện tại.');
        return res.redirect(`/change-password-admin/${idUser}`);
    }
    const result = await adminService.updatePassword(req.body, idUser);
    if (result) {
        req.flash('updatePassMsg', 'Đổi mật khẩu thành công.');
        return res.redirect(`/change-password-admin/${idUser}`);
    }
    req.flash('updatePassMsg', 'Đổi mật khẩu thất bại.');
    return res.redirect(`/change-password-admin/${idUser}`);
}

module.exports = {
    getHomePage,
    getAdminProfile,
    updateInformation,
    getChangePassword,
    updatePassword,
}