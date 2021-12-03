//존재하는 artistIdx인지
async function isExistArtistIdx(connection, params){
  const query = `
  SELECT EXISTS(SELECT artistIdx
    FROM Artist
    WHERE isDeleted = 'N' && artistIdx = ?) as isExist;
  `;
  const [rows] = await connection.query(query, params);
  return rows[0]['isExist'];
}

//작가 기본 정보
async function getArtistInfo(connection, params){
  const query = `
  SELECT A.artistIdx, U.nickname as name, U.imageUrl, A.introduction, A.company, A.major
  FROM Artist A
          JOIN User U on A.userIdx = U.userIdx && U.isDeleted = 'N'
  WHERE A.isDeleted = 'N' && A.artistIdx = ?;
  `;
  const [rows] = await connection.query(query, params);
  return rows[0];
}

//작가 약력
async function getArtistProfile(connection, params){
  const query = `
  SELECT content FROM ArtistProfile
  WHERE isDeleted = 'N' && artistIdx = ?;
  `;
  const [rows] = await connection.query(query, params);
  return rows;
}

//작가 전시정보
async function getArtistExhibition(connection, params){
  const query = `
  SELECT content FROM ArtistExhibition
  WHERE isDeleted = 'N' && artistIdx = ?;
  `;
  const [rows] = await connection.query(query, params);
  return rows;
}

//작가 별 총 craft 개수 
async function getArtistCraftCnt(connection, params){
  const query = `
  SELECT COUNT(productIdx) as totalCnt FROM Product
  WHERE isDeleted = 'N' && artistIdx = ?;
  `;
  const [rows] = await connection.query(query, params);
  return rows[0]['totalCnt'];
}

//작가 별 craft 조회
async function getArtistCraft(connection, params){
  const query = `
  SELECT P.productIdx,
        P.mainImageUrl,
        P.name,
        A.artistIdx,
        U.nickname                                               as artistName,
        P.price,
        IF(TIMESTAMPDIFF(DAY, P.createdAt, NOW()) > 3, 'N', 'Y') as isNew,
        IFNULL(R.totalReviewCnt, 0)                              as totalReviewCnt,
        IFNULL(L.totalLikeCnt, 0)                                as totalLikeCnt
  FROM Product P
          JOIN Artist A ON A.artistIdx = P.artistIdx && A.isDeleted = 'N'
          JOIN User U ON A.userIdx = U.userIdx && U.isDeleted = 'N'
          LEFT JOIN (SELECT productIdx, COUNT(productReviewIdx) as totalReviewCnt
                      FROM ProductReview
                      WHERE isDeleted = 'N'
                      GROUP BY productIdx) R ON P.productIdx = R.productIdx
          LEFT JOIN (SELECT productIdx, COUNT(userIdx) as totalLikeCnt
                      FROM ProductLike
                      GROUP BY productIdx) L ON P.productIdx = L.productIdx
  WHERE P.isDeleted = 'N' && P.artistIdx = ?
  ORDER BY (CASE WHEN ? = 'new' THEN P.createdAt END) ASC,
          (CASE WHEN ? = 'price' THEN P.price END) DESC,
          (CASE WHEN ? = 'review' THEN totalReviewCnt END) ASC,
          (CASE WHEN ? = 'popular' THEN totalLikeCnt END) ASC
  LIMIT ?, ?;
  `;
  const [rows] = await connection.query(query, params);
  return rows;
}

//작가 이름
async function getArtistName(connection, params){
  const query = `
  SELECT U.nickname FROM Artist A
  JOIN User U on A.userIdx = U.userIdx && U.isDeleted = 'N'
  WHERE A.isDeleted = 'N' && A.artistIdx = ?;
  `;
  const [rows] = await connection.query(query, params);
  return rows[0]['nickname'];
}

//태그에 작가이름이 들어가있는 아티클 목록
async function getArticleWithArtistTag(connection, params){
  const query = `
  SELECT articleIdx
  FROM ArticleTag
  WHERE tag LIKE CONCAT('%', ?, '%');
  `;
  const [rows] = await connection.query(query, params);
  return rows;
}

//작가 상품이 들어가있는 아티클 목록
async function getArticleWithArtistProduct(connection, params){
  const query = `
  SELECT AP.articleIdx
  FROM ArticleProduct AP
  JOIN Product P on AP.productIdx = P.productIdx && P.isDeleted = 'N'
  JOIN Artist A on P.artistIdx = A.artistIdx && A.isDeleted = 'N'
  WHERE AP.isDeleted = 'N' && A.artistIdx = ?;
  `;
  const [rows] = await connection.query(query, params);
  return rows;
}

//작가 별 아티클 조회
async function getArtistArticle(connection, params){
  const query = `
  SELECT A.articleIdx,
        A.articleCategoryIdx,
        A.mainImageUrl,
        A.title,
        A.editorIdx,
        E.nickname as editorName,
        DATE_FORMAT(A.createdAt, '%Y.%m.%d. %k:%i') as createdAt,
        IFNULL(AL.totalLikeCnt, 0) as totalLikeCnt
  FROM Article A
          JOIN Editor E on A.editorIdx = E.editorIdx && E.isDeleted = 'N'
          LEFT JOIN (SELECT articleIdx, COUNT(*) as totalLikeCnt
                      FROM ArticleLike
                      GROUP BY articleIdx) as AL ON AL.articleIdx = A.articleIdx
  WHERE A.isDeleted = 'N' && A.articleIdx IN (?)
  ORDER BY (CASE WHEN ? = 'new' THEN A.createdAt END) ASC,
          (CASE WHEN ? = 'popular' THEN totalLikeCnt END) ASC
  LIMIT ?, ?
  `;
  const [rows] = await connection.query(query, params);
  return rows;
}

module.exports = {
  isExistArtistIdx,
  getArtistInfo,
  getArtistProfile,
  getArtistExhibition,
  getArtistCraftCnt,
  getArtistCraft,
  getArtistName,
  getArticleWithArtistTag,
  getArticleWithArtistProduct,
  getArtistArticle,
}