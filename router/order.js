const express = require('express')
const router = express.Router()
const orderHandler = require('../router_handler/order')

// 购物车
router.post('/cart', orderHandler.get_shopCart)
router.post('/addCart', orderHandler.add_shopCart)
router.post('/getorder', orderHandler.get_order)

// 后台管理系统接口 
router.post('/order/get', orderHandler.back_getOrder)
router.post('/order/edit', orderHandler.back_editOrder)


module.exports = router;