const {CATEGORY} = require('../../../modules/constants');

//사용자 별 최근 검색어 가져오기(15개)
async function getRecentlySearch(connection, userIdx){
  const query = `
  SELECT S.searchIdx, S.word
  FROM UserSearch US
          JOIN Search S ON S.searchIdx = US.searchIdx
  WHERE US.userIdx = ${userIdx} && US.isDeleted = 'N'
  ORDER BY US.updatedAt DESC
  LIMIT 15
  `;
  const [rows] = await connection.query(query);
  return rows;
}

//인기 검색어 가져오기(10개)
async function getPopularSearch(connection){
  const query = `
  SELECT searchIdx, word FROM Search
  ORDER BY count DESC
  LIMIT 10
  `;
  const [rows] = await connection.query(query);
  return rows;
}

//word의 searchIdx가져오기
async function getSearchIdx(connection, word){
  const query = `
  SELECT searchIdx FROM Search
  WHERE word = '${word}';
  `;
  const [rows] = await connection.query(query);
  return rows[0];
}

//유효한 user의 search 항목인지
async function isExistUserSearchIdx(connection, userIdx, searchIdx){
  const query = `
  SELECT EXISTS(SELECT userSearchIdx
    FROM UserSearch
    WHERE userIdx = ${userIdx} && searchIdx = ${searchIdx} && isDeleted = 'N') as isExist
  `;
  const [rows] = await connection.query(query);
  return rows[0]['isExist'];
}

//사용자 최근검색어 삭제
async function deleteUserRecentlySearch(connection, userIdx, searchIdx){
  const query = `
  UPDATE UserSearch
  SET isDeleted = 'Y'
  WHERE userIdx = ${userIdx} && searchIdx = ${searchIdx};
  `;
  const [rows] = await connection.query(query);
  return rows;
}

//user의 지울 검색어가 있는지
async function isExistUserSearchs(connection, userIdx){
  const query = `
  SELECT EXISTS(SELECT userSearchIdx
    FROM UserSearch
    WHERE userIdx = ${userIdx} && isDeleted = 'N') as isExist;
  `;
  const [rows] = await connection.query(query);
  return rows[0]['isExist'];
}

//user의 최근검색어 전체 삭제
async function deleteAllUserRecentlySearch(connection, userIdx){
  const query = `
  UPDATE UserSearch
  SET isDeleted = 'Y'
  WHERE isDeleted = 'N' && userIdx = ${userIdx};
  `;
  const [rows] = await connection.query(query);
  return rows;
}

//작가명, 상품명, 상품 설명, 스토어 카테고리에 해당 키워드 들어가있는 상품 가져오기
async function getCraftCorrespondToBasic(connection, keyword){
  const query = `
  SELECT C.craftIdx
  FROM Craft C
          JOIN CraftCategory CC ON CC.craftCategoryIdx = C.craftCategoryIdx
          JOIN Artist A ON A.artistIdx = C.artistIdx
          JOIN User U ON U.userIdx = A.userIdx
  WHERE C.name LIKE CONCAT('%', ?, '%') || U.nickname LIKE CONCAT('%', ?, '%')
            || C.content LIKE CONCAT('%', ?, '%') || CC.name LIKE CONCAT('%', ?, '%');
  `;
  const [rows] = await connection.query(query, [keyword, keyword, keyword, keyword]);
  return rows.map(item => item.craftIdx); 
}

//소재에 해당 키워드 들어가있는 상품 가져오기
async function getCraftCorrespondToMaterial(connection, keyword){
  const query = `
  SELECT DISTINCT C.craftIdx FROM Craft C
  JOIN CraftMaterial CM on C.craftIdx = CM.craftIdx
  WHERE CM.material LIKE CONCAT('%', ?, '%');
  `;
  const [rows] = await connection.query(query, [keyword]);
  return rows.map(item => item.craftIdx);
}

//용도 아이템에 해당 키워드 들어가있는 상품 가져오기
async function getCraftCorrespondToUsage(connection, keyword){
  const query = `
  SELECT DISTINCT C.craftIdx,
        CU.craftUsageItemIdx,
        CUC.name                      AS craftUsageCategory,
        IFNULL(CU.etcUsage, CUI.name) AS craftUsage
  FROM Craft C
          JOIN CraftUsage CU ON CU.craftIdx = C.craftIdx
          JOIN CraftUsageItem CUI ON CUI.craftUsageItemIdx = CU.craftUsageItemIdx
          JOIN CraftUsageCategory CUC on CUC.craftUsageCategoryIdx = CUI.craftUsageCategoryIdx
  WHERE CUC.name LIKE CONCAT('%', ?, '%') || CU.etcUsage LIKE CONCAT('%', ?, '%') || CUI.name LIKE CONCAT('%', ?, '%');
  `;
  const [rows] = await connection.query(query, [keyword, keyword, keyword]);
  return rows.map(item => item.craftIdx);
}

//qna 검색
async function getQnACorrespond(connection, keyword){
  const query = `
  SELECT ${CATEGORY.QNA} AS categoryIdx, Q.qnaIdx
  FROM QnA Q
          JOIN User U ON U.userIdx = Q.userIdx && U.isDeleted = 'N'
  WHERE Q.title LIKE CONCAT('%', ?, '%') || Q.content LIKE CONCAT('%', ?, '%') && Q.isDeleted = 'N'
  ORDER BY Q.qnaIdx;
  `;
  const [rows] = await connection.query(query, [keyword, keyword, keyword]);
  return rows;
}

//story 검색
async function getStoryCorrespond(connection, keyword){
  const query = `
  SELECT ${CATEGORY.STORY} AS categoryIdx, S.storyIdx
  FROM Story S
          JOIN User U ON U.userIdx = S.userIdx && U.isDeleted = 'N'
  WHERE S.title LIKE CONCAT('%', ?, '%') || S.content LIKE CONCAT('%', ?, '%') && S.isDeleted = 'N'
  ORDER BY S.storyIdx;
  `;
  const [rows] = await connection.query(query, [keyword, keyword, keyword]);
  return rows;
}

//abtest 검색
async function getAbTewstCorrespond(connection, keyword){
  const query = `
  SELECT ${CATEGORY.ABTEST} AS categoryIdx, AB.abTestIdx
  FROM ABTest AB
          JOIN Artist A ON A.artistIdx = AB.artistIdx && A.isDeleted = 'N'
          JOIN User U ON U.userIdx = A.userIdx && U.isDeleted = 'N'
  WHERE AB.isDeleted = 'N' && AB.content LIKE CONCAT('%', ?, '%') || U.nickname LIKE CONCAT('%', ?, '%')
  ORDER BY AB.abTestIdx;
  `;
  const [rows] = await connection.query(query, [keyword, keyword]);
  return rows;
}

module.exports = {
  getRecentlySearch,
  getPopularSearch,
  getSearchIdx,
  isExistUserSearchIdx,
  deleteUserRecentlySearch,
  isExistUserSearchs,
  deleteAllUserRecentlySearch,
  getCraftCorrespondToBasic,
  getCraftCorrespondToMaterial,
  getCraftCorrespondToUsage,
  getQnACorrespond,
  getStoryCorrespond,
  getAbTewstCorrespond,
}