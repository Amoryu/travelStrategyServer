const express = require('express')
const router = express.Router()
const hotelHandler = require('../router_handler/hotel')

/**
 * 小程序接口
 */
router.post('/hotel', hotelHandler.getHotelList)
router.post('/room', hotelHandler.getRoom)
router.post('/roompayment', hotelHandler.roomPayment)

/**
 * 后台管理系统接口
 */
// 酒店信息
router.post('/hotel/get', hotelHandler.back_getHotelInfo)
router.post('/hotel/edit', hotelHandler.back_editHotel)
router.post('/hotel/add', hotelHandler.back_addHotel)
// 房间管理
router.post('/getroom', hotelHandler.back_getRoom)
router.post('/addroom', hotelHandler.back_addRoom)
router.post('/editroom', hotelHandler.back_editRoom)
router.post('/deleteroom', hotelHandler.back_deleteRoom)

module.exports = router;