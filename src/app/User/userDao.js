//핸드폰 번호 중복 확인
async function isExistPhone(connection, params){
  const query = `
  SELECT EXISTS(SELECT phone FROM User WHERE isDeleted = 'N' && phone = ?) as isExist;
  `;
  const [rows] = await connection.query(query, params);
  return rows[0]['isExist'];
}

//닉네임 중복 확인
async function isExistNickname(connection, params){
  const query = `
  SELECT EXISTS(SELECT nickname FROM User WHERE isDeleted = 'N' && nickname = ?) as isExist;
  `;
  const [rows] = await connection.query(query, params);
  return rows[0]['isExist'];
}

//사용자 계정 생성
async function createUser(connection, params){
  const query = `
  INSERT INTO User(phone, nickname)
  VALUES (?, ?);
  `;
  const [rows] = await connection.query(query, params);
  return rows;
}

module.exports = {
  isExistPhone,
  isExistNickname,
  createUser,
}