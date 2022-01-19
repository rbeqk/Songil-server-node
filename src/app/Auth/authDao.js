//존재하는 이메일인지
async function isExistEmail(connection, email){
  const query = `
  SELECT EXISTS(SELECT * FROM User WHERE email = ? && isDeleted = 'N') as isExist;
  `;
  const [rows] = await connection.query(query, [email]);
  return rows[0]['isExist'];
}

//존재하는 닉네임인지
async function isExistNickname(connection, nickname){
  const query = `
  SELECT EXISTS(SELECT * FROM User WHERE nickname = ? && isDeleted = 'N') as isExist;
  `;
  const [rows] = await connection.query(query, [nickname]);
  return rows[0]['isExist'];
}

module.exports = {
  isExistEmail,
  isExistNickname,
}