const reviewService = require('../../model/reviewService');
const Paginator = require("paginator");
const qs = require('qs');

const getPagination = (page, size) => {
    const limit = size ? +size : 5;
    const offset = page ? page * limit : 0;

    return { limit, offset };
};
let getListReview = async (req, res) => {
    const paginator = new Paginator(5, 5);
    const id = req.params.id;

    let currentPage = req.query.page ? +req.query.page : 1;
    //console.log("page: ", currentPage)
    const allReview = await reviewService.getAllReview(id);
    const length = allReview.length;

    const pagination_info = paginator.build(length, currentPage);
    if (currentPage < 1) currentPage = 1;
    else if (currentPage > pagination_info.total_pages) currentPage = pagination_info.total_pages;
    const { limit, offset } = getPagination(currentPage - 1, req.query.size);
    let iterator = (currentPage - 5) < 1 ? 1 : currentPage - 4;
    let endingLink = (iterator + 4) <= pagination_info.total_pages ? (iterator + 4) : currentPage + (pagination_info.total_pages - currentPage);

    const reviews = await reviewService.getReviewPage(id, offset, limit);
    return res.status(200).json({reviews, pagination_info, iterator, endingLink});

}
module.exports = {
    getListReview
}