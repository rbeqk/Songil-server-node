const artistPlaceDao = require('./artistPlaceDao');
const productDao = require('../Product/productDao');
const {pool} = require('../../../config/database');
const {logger} = require('../../../config/winston');
const {response, errResponse} = require('../../../config/response');
const baseResponse = require('../../../config/baseResponseStatus');

exports.getArtistInfo = async (params) => {
  try{
    const connection = await pool.getConnection(async conn => conn);
    try{

      //존재하는 작가idx인지
      const isExistArtistIdx = await artistPlaceDao.isExistArtistIdx(connection, params);
      if (!isExistArtistIdx) return errResponse(baseResponse.INVALID_ARTIST_IDX);

      //작가 기본 정보 가져오기
      const artistInfo = await artistPlaceDao.getArtistInfo(connection, params);

      let result = {
        'artistIdx': artistInfo.artistIdx,
        'name': artistInfo.name,
        'imageUrl': artistInfo.imageUrl,
        'introduction': artistInfo.introduction,
        'company': artistInfo.company,
        'major': artistInfo.major,
      };

      //작가 약력 가져오기
      const artistProfile = await artistPlaceDao.getArtistProfile(connection, params);
      result.profile = [];
      artistProfile.forEach(item => {
        result.profile.push(item.content);
      })

      //작가 전시정보 가져오기
      const artistExhibition = await artistPlaceDao.getArtistExhibition(connection, params);
      result.exhibition = [];
      artistExhibition.forEach(item => {
        result.exhibition.push(item.content);
      })
      
      connection.release();
      return response(baseResponse.SUCCESS, result);

    }catch(err){
      connection.release();
      logger.error(`getArtistInfo DB Query Error: ${err}`);
      return errResponse(baseResponse.DB_ERROR);
    }
  }catch(err){
    logger.error(`getArtistInfo DB Connection Error: ${err}`);
    return errResponse(baseResponse.DB_ERROR);
  }
}

exports.getArtistCraftTotalPage = async (params) => {
  try{
    const connection = await pool.getConnection(async conn => conn);
    try{

      //존재하는 작가idx인지
      const isExistArtistIdx = await artistPlaceDao.isExistArtistIdx(connection, params);
      if (!isExistArtistIdx) return errResponse(baseResponse.INVALID_ARTIST_IDX);

      const craftCnt = await artistPlaceDao.getArtistCraftCnt(connection, params);
      
      const pageItemCnt = 5;  //한 페이지당 보여줄 아이템 개수
      const totalPages = (craftCnt % pageItemCnt == 0) ? craftCnt / pageItemCnt : parseInt(craftCnt / pageItemCnt) + 1;  //총 페이지 수
      
      const result = {'totalPages': totalPages};
      
      connection.release();
      return response(baseResponse.SUCCESS, result);

    }catch(err){
      connection.release();
      logger.error(`getArtistCraftTotalPage DB Query Error: ${err}`);
      return errResponse(baseResponse.DB_ERROR);
    }
  }catch(err){
    logger.error(`getArtistCraftTotalPage DB Connection Error: ${err}`);
    return errResponse(baseResponse.DB_ERROR);
  }
}

exports.getArtistCraft = async (params) => {
  const artistIdx = params[0];
  const page = params[1];
  const filter = params[2];
  const userIdx = params[3];

  try{
    const connection = await pool.getConnection(async conn => conn);
    try{

      //존재하는 작가idx인지
      const isExistArtistIdx = await artistPlaceDao.isExistArtistIdx(connection, [artistIdx]);
      if (!isExistArtistIdx) return errResponse(baseResponse.INVALID_ARTIST_IDX);

      const craftCnt = await artistPlaceDao.getArtistCraftCnt(connection, params);
      
      const pageItemCnt = 5;  //한 페이지당 보여줄 아이템 개수
      const totalPages = (craftCnt % pageItemCnt == 0) ? craftCnt / pageItemCnt : parseInt(craftCnt / pageItemCnt) + 1;  //총 페이지 수
      if (page <= 0 || page > totalPages) return errResponse(baseResponse.INVALID_PAGE);  //존재하는 page인지
      
      const startItemIdx = (page - 1) * pageItemCnt;

      //작가의 craft 가져오기
      //filter popular: 인기순 / new: 최신순 / review: 리뷰많은순 / price: 가격낮은순
      const artistCraft = await artistPlaceDao.getArtistCraft(connection, [artistIdx, filter, filter, filter, filter, startItemIdx, pageItemCnt]);

      let result = {};
      result.totalCraftCnt = artistCraft.length;
      result.product = null;

      if (artistCraft.length){
        result.product = [];
        for (item of artistCraft){
          const isLike = await productDao.getUserLikeProduct(connection, [item.productIdx, userIdx]);
          result.product.push({
            'productIdx': item.productIdx,
            'mainImageUrl': item.mainImageUrl,
            'name': item.name,
            'artistIdx': item.artistIdx,
            'artistName': item.artistName,
            'price': item.price,
            'isNew': item.isNew,
            'totalLikeCnt': item.totalLikeCnt,
            'isLike': !userIdx ? 'N' : (isLike ? 'Y': 'N'),
            'totalReviewCnt': item.totalReviewCnt
          });
        }
      }

      result.product.reverse();

      //총 작가의 아티클 개수 가져오기
      
      connection.release();
      return response(baseResponse.SUCCESS, result);

    }catch(err){
      connection.release();
      logger.error(`getArtistCraft DB Query Error: ${err}`);
      return errResponse(baseResponse.DB_ERROR);
    }
  }catch(err){
    logger.error(`getArtistCraft DB Connection Error: ${err}`);
    return errResponse(baseResponse.DB_ERROR);
  }
}