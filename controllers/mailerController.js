const nodemailer = require('nodemailer');
const authService = require('../model/authService');

let getMail = async (req, res, next) => {
    const { username, email: mail, password: pw, confirmPassword } = req.body;
    //console.log(req.body)
    const link = `<a href="http://localhost:3000/verify?username=${username}&email=${mail}&pw=${pw}"> bấm vào đi đừng sợ</a>`
    const msg = {
        from: "tranxuanquang79@gmail.com",
        to: mail,
        subject: "Test sendmail",
        html: link
    };
    //console.log(msg);
    nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: "tranxuanquang79@gmail.com",
            pass: "acwktshyozykvwzp",
        },
        port: 465,
        host: 'smtp.gmail.com'
    })

        .sendMail(msg, (err) => {
            if (err) {
                req.flash('forgetMessage', 'Lỗi')
                return console.log('Error occurs', err);
            } else {
                return req.flash('forgetMessage', 'Thành công')
            
            }
        })
    next();
}

let getVerifyEmail = async (req, res) => {

    return res.render('verify-email.ejs');
}

let getForgetEmail = async (req, res) => {
    const {
        email: mail
    } = req.body
    const idUser = await authService.getIDUserByEmail(mail);
    if (!idUser) {
        req.flash('emailMessage', 'Email không tồn tại');
        return res.redirect('/');
    }
    const msg = {
        from: "tranxuanquang79@gmail.com",
        to: mail,
        subject: "Test sendmail",
        html: `<a href="http://localhost:3000/reset-password?iduser=${idUser.IDUSER}">cccc</a>`
    };
    //console.log(msg);
    nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: "tranxuanquang79@gmail.com",
            pass: "acwktshyozykvwzp",
        },
        port: 465,
        host: 'smtp.gmail.com'
    })

        .sendMail(msg, (err) => {
            if (err) {
                req.flash('forgetMessage', 'Lỗi')
                return console.log('Error occurs', err);
            } else {

                //return req.flash('forgetMessage', 'Thành công')
                return res.render('confirm.ejs');
            }
        })
}

let getResetPassword = async (req, res) => {
    const {iduser: idUser} = req.query;
    console.log(idUser);
    return res.render('reset-password.ejs', {idUser});
}


module.exports = {
    getMail,
    getVerifyEmail,
    getForgetEmail,
    getResetPassword
}