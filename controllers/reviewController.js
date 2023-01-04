const reviewService = require('../model/reviewService');

let postReview = async (req, res) => {
    const content = req.body.myreview;
    const today = new Date();
    var date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
    var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
    await reviewService.addReview(req.params.id, res.locals.user.id, content, date + ' ' + time);
    return res.redirect(`/products/details/` + req.params.id);
}

module.exports = {
    postReview
}