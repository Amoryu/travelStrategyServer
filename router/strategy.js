const express = require('express')
const router = express.Router()
const strategyHandler = require('../router_handler/strategy')
const { upload } = require('../common/utils.js')


// 小程序接口 
router.post('/collection', strategyHandler.collectStrategy)
router.get('/collection', strategyHandler.get_collectStrategy)
router.get('/collection/status', strategyHandler.getCollectState)


// 后台管理系统接口
router.post('/strategy/type', strategyHandler.addStrategyCate)
router.delete('/strategy/type', strategyHandler.deleteStrategyCate)
router.put('/strategy/type', strategyHandler.editStrategyCate)
router.get('/strategy/type', strategyHandler.getStrategyCate)


router.post('/strategy', strategyHandler.addStrategy)
router.delete('/strategy', strategyHandler.delete_strategy)
router.put('/strategy', strategyHandler.editStrategy)
router.get('/strategy', strategyHandler.getStrategy)

router.post('/strategyshow', strategyHandler.setStrategyCateShow)

module.exports = router;