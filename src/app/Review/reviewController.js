const reviewProvider = require("./reviewProvider");
const reviewService = require("./reviewService");
const baseResponse = require("../../../config/baseResponseStatus");
const {response} = require("../../../config/response");
const {errResponse} = require("../../../config/response");
const jwt = require("jsonwebtoken");

require('dotenv').config();

/*
  API No. 3.13
  API Name: 상품 리뷰 페이지 개수 조회 API
  [GET] /shop/products/:productIdx/reviews/page
*/
exports.getReviewTotalPage = async (req, res) => {
  const {productIdx} = req.params;

  let params = [productIdx];
  const getReviewTotalPage = await reviewProvider.getReviewTotalPage(params);

  return res.send(getReviewTotalPage);
}

/*
  API No. 3.12
  API Name: 상품 리뷰 조회 API
  [GET] /shop/products/:productIdx/reviews
  query: page
*/
exports.getReview = async (req, res) => {
  const {page, onlyPhoto} = req.query;
  if (!(page && onlyPhoto)) return res.send(errResponse(baseResponse.IS_EMPTY));

  const token = req.headers['x-access-token'];
  const {productIdx} = req.params;
  let params = [token];

  //jwt가 있을 경우 유효한지 확인
  let userIdx;
  if (token){
    try{
      userIdx = jwt.verify(token, process.env.jwtSecret);
    }catch(err){
      return res.send(errResponse(baseResponse.TOKEN_VERIFICATION_FAILURE));
    }
  }

  params = [productIdx, page, onlyPhoto];

  const getReview = await reviewProvider.getReview(params);

  return res.send(getReview);
}