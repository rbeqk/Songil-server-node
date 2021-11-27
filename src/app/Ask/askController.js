const askService = require('./askService');
const askProvider = require('./askProvider');
const baseResponse = require("../../../config/baseResponseStatus");
const {response} = require("../../../config/response");
const {errResponse} = require("../../../config/response");

/*
  API No. 3.14
  API Name: 1:1 문의하기 작성 (사용자) API
  [POST] /shop/products/:productIdx/ask
*/
exports.createProductAsk = async (req, res) => {
  const {userIdx} = req.verifiedToken;
  const {content} = req.body;
  const {productIdx} = req.params;

  if (!content) return res.send(errResponse(baseResponse.IS_EMPTY));
  if (content.length > 300) return res.send(errResponse(baseResponse.EXCEED_ASK_CONTENT));

  let params = [userIdx, productIdx, content];
  const createProductAsk = await askService.createProductAsk(params);

  return res.send(createProductAsk);
}

/*
  API No. 8.2
  API Name: 1:1 문의 내역 페이지 조회 API
  [GET] /mypage/ask/page
*/
exports.getAskTotalPage = async (req, res) => {
  const {userIdx} = req.verifiedToken;

  let params = [userIdx];
  const getAskTotalPage = await askProvider.getAskTotalPage(params);

  return res.send(getAskTotalPage);
}