const ITEMS_PER_PAGE = {
  ARTIST_ASK_ASK_PER_PAGE: 5,
  ARTIST_PLACE_ARTIST_CRAFT_PER_PAGE: 5,
  ARTIST_PLACE_ARTIST_ARTICLE_PER_PAGE: 5,
  USER_ASK_PER_PAGE: 5,
  CRAFT_COMMENT_PER_PAGE: 5,
  LIKED_ARTICLE_PER_PAGE: 5,
  LIKED_CRAFT_PER_PAGE: 5,
  MY_PAGE_WRITTEN_CRAFT_COMMENT_PER_PAGE: 5,
  MY_PAGE_WRITTEN_POST_PER_PAGE: 5,
  LIKED_WITH_PER_PAGE: 5,
  QNA_COMMENT_PER_PAGE: 5,
  CRAFT_BY_CATEGPRY_PER_PAGE: 5,
  STORY_COMMENT_PER_PAGE: 5,
  AB_TEST_COMMENT_PER_PAGE: 5,
  WITH_BY_CATEGORY_PER_PAGE: 10,
  MY_PAGE_WRITTEN_POST_COMMENT_PER_PAGE: 5,
  MY_PAGE_ORDER_LIST_PER_PAGE: 5
};

const CATEGORY= {
  STORY: 1,
  QNA: 2,
  ABTEST: 3,
  CRAFT: 4
};

const POINT_INFO = {
  USED_POINT_WHEN_PAYING: 1,
  SAVED_POINT_BY_PAYING: 2,
  SAVED_POINT_BY_REVIEWING: 3,
  RETURNED_POINT_BY_CANCEL: 4,
  RETURNED_POINT_BY_RETURN: 5
};

const ORDER_STATUS = {
  READY_FOR_DELIVERY: 1,
  BEING_DELIVERIED: 2,
  DELIVERY_COMPLETED: 3,
  REQUEST_CANCEL: 4,
  REJECT_CANCEL:5,
  CALCEL_COMPLETED: 6,
  REQUEST_RETURN: 7,
  REJECT_RETURN:5,
  RETURN_COMPLELTED: 8
};

const DELIVERY_STATUS = {
  BEFORE_DELIVERY: 1,
  BEING_DELIVERIED: 2,
  DELIVERY_COMPLETED: 3
}

module.exports = {
  ITEMS_PER_PAGE,
  CATEGORY,
  POINT_INFO,
  ORDER_STATUS,
  DELIVERY_STATUS,
}