//존재하는 orderCraftIdx인지
async function isExistOrderCraftIdx(connection, orderCraftIdx){
  const query = `
  SELECT EXISTS(SELECT orderCraftIdx
    FROM OrderCraft
    WHERE orderCraftIdx = ${orderCraftIdx}) as isExist;
  `;
  const [rows] = await connection.query(query);
  return rows[0]['isExist'];
}

//작가의 orderCraftIdx인지
async function isArtistOrderCraftIdx(connection, artistIdx, orderCraftIdx){
  const query = `
  SELECT EXISTS(SELECT OC.craftIdx, C.artistIdx
      FROM OrderCraft OC
              JOIN Craft C ON C.craftIdx = OC.craftIdx
      WHERE OC.orderCraftIdx = ${orderCraftIdx} && C.artistIdx = ${artistIdx}) as isExist;
  `;
  const [rows] = await connection.query(query);
  return rows[0]['isExist'];
}

//발송정보 입력
async function createSendingInfo(connection, orderCraftIdx, sentAt, tCode, tInvoice){
  const query = `
  UPDATE OrderCraft
  SET tCode    = ?,
      tInvoice = ?,
      sentAt   = ?
  WHERE orderCraftIdx = ${orderCraftIdx};
  `;
  const [rows] = await connection.query(query, [tCode, tInvoice, sentAt]);
  return rows;
}

//발송정보 입력했는지
async function isEnteredDeliveryInfo(connection, orderCraftIdx){
  const query = `
  SELECT IF(tInvoice IS NULL, 0, 1) as isExist
  FROM OrderCraft
  WHERE orderCraftIdx = ${orderCraftIdx}
  `;
  const [rows] = await connection.query(query);
  return rows[0]['isExist'];
}

//발송정보 가져오기
async function getSendingInfo(connection, orderCraftIdx){
  const query = `
  SELECT YEAR(sentAt) as year, MONTH(sentAt) as month, DAY(sentAt) as day, tCode, tInvoice
  FROM OrderCraft
  WHERE orderCraftIdx = ${orderCraftIdx};
  `;
  const [rows] = await connection.query(query);
  return rows[0];
}

//유저의 orderCraftIdx인지
async function isUserOrderCraftIdx(connection, userIdx, orderCraftIdx){
  const query = `
  SELECT EXISTS(SELECT O.orderIdx
      FROM OrderCraft OC
              JOIN OrderT O ON OC.orderIdx = O.orderIdx
      WHERE OC.orderCraftIdx = ${orderCraftIdx} && O.userIdx = ${userIdx}) as isExist;
  `;
  const [rows] = await connection.query(query);
  return rows[0]['isExist'];
}

module.exports = {
  isExistOrderCraftIdx,
  isArtistOrderCraftIdx,
  createSendingInfo,
  isEnteredDeliveryInfo,
  getSendingInfo,
  isUserOrderCraftIdx,
}