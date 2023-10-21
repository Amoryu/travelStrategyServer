const express = require('express')
const router = express.Router()
const orderHandler = require('../router_handler/order')

// 购物车
router.get('/cart', orderHandler.get_shopCart)
router.post('/cart', orderHandler.add_shopCart)

// 后台管理系统接口 
router.get('/order', orderHandler.back_getOrder)
router.put('/order', orderHandler.back_editOrder)

router.post('/ticket/payment', orderHandler.ticketPayment)
router.post('/room/payment', orderHandler.roomPayment)

module.exports = router;