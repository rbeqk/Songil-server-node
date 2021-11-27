//현재 사용자의 좋아요 상태 가져오기
async function isLike(connection, params){
  const query = `
  SELECT EXISTS(SELECT *
  FROM ProductLike
  WHERE userIdx = ? && productIdx = ?) as isLike;
  `;
  const [rows] = await connection.query(query, params);
  return rows[0]['isLike'];
}

//사용자의 좋아요 삭제
async function changeToDisLike(connection, params){
  const query = `
  DELETE FROM ProductLike
  WHERE userIdx = ? && productIdx = ?;
  `;
  const [rows] = await connection.query(query, params);
  return rows;
}

//사용자의 좋아요 추가
async function changeToLike(connection, params){
  const query = `
  INSERT INTO ProductLike(userIdx, productIdx) VALUES (?, ?);
  `;
  const [rows] = await connection.query(query, params);
  return rows;
}

//상품의 총 좋아요 개수
async function getTotalLikeCnt(connection, params){
  const query = `
  SELECT COUNT(*) as totalLikeCnt FROM ProductLike WHERE productIdx = ?;
  `;
  const [rows] = await connection.query(query, params);
  return rows[0]['totalLikeCnt'];
}

module.exports = {
  isLike,
  changeToDisLike,
  changeToLike,
  getTotalLikeCnt,
}