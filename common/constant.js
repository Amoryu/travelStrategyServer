// 数据库表
const TABLE = {
  StrategyCategory: "t_strategycate", //攻略分类表
  Strategy: "t_strategy", //攻略表
  Scenery: "t_scene", //景点表
  Ticket: "t_ticket", //门票表
  Order: "t_order", //订单表
  Hotel: "t_hotel", //酒店表
  HotelImage: "t_hotel_image", //酒店图片表
  Room: "t_room", //房间表
  User: "t_user", //用户表
  Swiper: "t_swiper", //轮播图表
  ShopCart: "t_shopCart", //购物车表
  Collection: "t_collection", //收藏表
  TourRoute: "t_tour_route", //路线表
  CurArea: "t_current_area"  //当前定位表
}

// 返回值的HTTP状态码
const RESULT_CODE = {
  SUCCESS: 200, //请求成功
  ERROR: 500, //服务器错误
  OVERDUE: 401, //token逾期
  TIMEOUT: 30000, //请求超市
}

// 开发者工具的小程序配置信息
const APPLET = {
  appid: 'xxxxxxx',  // 小程序Appid
  secret: 'xxxxxxxxxxxxxx'  // 小程序密钥AppSecret
}

// 导出
module.exports = {
  TABLE,
  RESULT_CODE,
  APPLET
}