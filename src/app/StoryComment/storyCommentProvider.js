const storyDao = require('../Story/storyDao');
const storyCommentDao = require('./storyCommentDao');
const {pool} = require('../../../config/database');
const {logger} = require('../../../config/winston');
const {response, errResponse} = require('../../../config/response');
const baseResponse = require('../../../config/baseResponseStatus');

exports.getStoryCommentTotalPage = async (storyIdx) => {
  try{
    const connection = await pool.getConnection(async conn => conn);
    try{

      //존재하는 storyIdx인지
      const isExistStoryIdx = await storyDao.isExistStoryIdx(connection, storyIdx);
      if (!isExistStoryIdx) return errResponse(baseResponse.INVALID_STORY_IDX);

      const storyParentCommentCnt = await storyCommentDao.getStoryParentCommentCnt(connection, storyIdx);  //총 story Parent댓글 개수
      const storyReCommentCnt = await storyCommentDao.getStoryReCommentCnt(connection, storyIdx);  //총 story Re댓글 개수
      const storyCommentCnt = storyParentCommentCnt + storyReCommentCnt;

      const pageItemCnt = 5;  //한 페이지당 보여줄 아이템 개수
      const totalPages = (storyCommentCnt % pageItemCnt == 0) ? storyCommentCnt / pageItemCnt : parseInt(storyCommentCnt / pageItemCnt) + 1;  //총 페이지 수

      const result = {'totalPages': totalPages};

      connection.release();
      return response(baseResponse.SUCCESS, result);
      
    }catch(err){
      connection.release();
      logger.error(`getStoryCommentTotalPage DB Query Error: ${err}`);
      return errResponse(baseResponse.DB_ERROR);
    }
  }catch(err){
    logger.error(`getStoryCommentTotalPage DB Connection Error: ${err}`);
    return errResponse(baseResponse.DB_ERROR);
  }
}