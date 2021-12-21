//존재하는 artistIdx인지
async function isExistArtistIdx(connection, artistIdx){
  const query = `
  SELECT EXISTS(SELECT artistIdx
    FROM Artist
    WHERE isDeleted = 'N' && artistIdx = ${artistIdx}) as isExist;
  `;
  const [rows] = await connection.query(query);
  return rows[0]['isExist'];
}

//작가 기본 정보
async function getArtistInfo(connection, artistIdx){
  const query = `
  SELECT A.artistIdx, U.nickname as name, U.imageUrl, A.introduction, A.company, A.major
  FROM Artist A
          JOIN User U on A.userIdx = U.userIdx && U.isDeleted = 'N'
  WHERE A.isDeleted = 'N' && A.artistIdx = ${artistIdx};
  `;
  const [rows] = await connection.query(query);
  return rows[0];
}

//작가 약력
async function getArtistProfile(connection, artistIdx){
  const query = `
  SELECT content FROM ArtistProfile
  WHERE isDeleted = 'N' && artistIdx = ${artistIdx};
  `;
  const [rows] = await connection.query(query);
  return rows;
}

//작가 전시정보
async function getArtistExhibition(connection, artistIdx){
  const query = `
  SELECT content FROM ArtistExhibition
  WHERE isDeleted = 'N' && artistIdx = ${artistIdx};
  `;
  const [rows] = await connection.query(query);
  return rows;
}

//작가 별 총 craft 개수 
async function getArtistCraftCnt(connection, artistIdx){
  const query = `
  SELECT COUNT(craftIdx) as totalCnt
  FROM Craft
  WHERE isDeleted = 'N' && artistIdx = ${artistIdx};
  `;
  const [rows] = await connection.query(query);
  return rows[0]['totalCnt'];
}

//작가 별 craft 조회
async function getArtistCraft(connection, artistIdx, filter, startItemIdx, pageItemCnt){
  const query = `
  SELECT C.craftIdx,
    C.mainImageUrl,
    C.name,
    A.artistIdx,
    U.nickname                                               as artistName,
    C.price,
    C.isSoldOut,
    IF(TIMESTAMPDIFF(DAY, C.createdAt, NOW()) > 3, 'N', 'Y') as isNew,
    IFNULL(CC.totalCommentCnt, 0)                             as totalCommentCnt,
    IFNULL(L.totalLikeCnt, 0)                                as totalLikeCnt
  FROM Craft C
      JOIN Artist A ON A.artistIdx = C.artistIdx && A.isDeleted = 'N'
      JOIN User U ON A.userIdx = U.userIdx && U.isDeleted = 'N'
      LEFT JOIN (SELECT craftIdx, COUNT(craftCommentIdx) as totalCommentCnt
                FROM CraftComment
                WHERE isDeleted = 'N'
                GROUP BY craftIdx) CC ON C.craftIdx = CC.craftIdx
      LEFT JOIN (SELECT craftIdx, COUNT(userIdx) as totalLikeCnt
                FROM CraftLike
                GROUP BY craftIdx) L ON C.craftIdx = L.craftIdx
  WHERE C.isDeleted = 'N' && C.artistIdx = ${artistIdx}
  ORDER BY (CASE WHEN '${filter}' = 'new' THEN C.createdAt END) ASC,
      (CASE WHEN '${filter}' = 'price' THEN C.price END) DESC,
      (CASE WHEN '${filter}' = 'comment' THEN totalCommentCnt END) ASC,
      (CASE WHEN '${filter}' = 'popular' THEN totalLikeCnt END) ASC
  LIMIT ${startItemIdx}, ${pageItemCnt};
  `;
  const [rows] = await connection.query(query);
  return rows;
}

//작가 이름
async function getArtistName(connection, artistIdx){
  const query = `
  SELECT U.nickname FROM Artist A
  JOIN User U on A.userIdx = U.userIdx && U.isDeleted = 'N'
  WHERE A.isDeleted = 'N' && A.artistIdx = ${artistIdx};
  `;
  const [rows] = await connection.query(query);
  return rows[0]['nickname'];
}

//태그에 작가이름이 들어가있는 아티클 목록
async function getArticleWithArtistTag(connection, artistName){
  const query = `
  SELECT articleIdx
  FROM ArticleTag
  WHERE tag LIKE CONCAT('%', '${artistName}', '%');
  `;
  const [rows] = await connection.query(query);
  return rows;
}

//작가 상품이 들어가있는 아티클 목록
async function getArticleWithArtistCraft(connection, artistIdx){
  const query = `
  SELECT AC.articleIdx
  FROM ArticleCraft AC
          JOIN Craft C on AC.craftIdx = C.craftIdx && C.isDeleted = 'N'
          JOIN Artist A on C.artistIdx = A.artistIdx && A.isDeleted = 'N'
  WHERE AC.isDeleted = 'N' && A.artistIdx = ${artistIdx};
  `;
  const [rows] = await connection.query(query);
  return rows;
}

//작가 별 아티클 조회
async function getArtistArticle(connection, articleList, filter, startItemIdx, pageItemCnt){
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
  WHERE A.isDeleted = 'N' && A.articleIdx IN (${articleList})
  ORDER BY (CASE WHEN '${filter}' = 'new' THEN A.createdAt END) ASC,
          (CASE WHEN '${filter}' = 'popular' THEN totalLikeCnt END) ASC
  LIMIT ${startItemIdx}, ${pageItemCnt}
  `;
  const [rows] = await connection.query(query);
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
  getArticleWithArtistCraft,
  getArtistArticle,
}