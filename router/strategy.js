const express = require('express')
const router = express.Router()
const strategyHandler = require('../router_handler/strategy')
const { upload } = require('../common/utils.js')


// 小程序接口 
router.get('/strategy', strategyHandler.get_strategy)
router.post('/mystrategy', strategyHandler.get_my_strategy)
router.post('/upload', upload.single('file'), strategyHandler.publish_strategy)
router.post('/image', upload.single('file'), strategyHandler.postImage)
router.post('/content', strategyHandler.editContent)
router.get('/category', strategyHandler.get_strategy_type)
router.post('/delete', strategyHandler.delete_strategy)
router.post('/collection', strategyHandler.get_collectStrategy)
router.post('/collect', strategyHandler.collectStrategy)
router.post('/collectState', strategyHandler.getCollectState)
router.post('/publish', strategyHandler.publish)
router.post('/edit', strategyHandler.edit)

// 10月5日接口修改
router.post('/article', strategyHandler.getArticle)



// 后台管理系统接口
router.get('/strategycate', strategyHandler.back_getStrategyCate)
router.post('/strategy/addType', strategyHandler.back_addStrategyCate)
router.post('/strategy/editType', strategyHandler.back_editStrategyCate)
router.post('/strategy/deleteType', strategyHandler.back_deleteStrategyCate)

router.post('/strategyshow', strategyHandler.back_setStrategyCateShow)
router.post('/getstrategy', strategyHandler.back_getStrategy)
router.post('/addstrategy', strategyHandler.back_addStrategy)
router.post('/editstrategy', strategyHandler.back_editStrategy)
router.post('/deletestrategy', strategyHandler.back_deleteStrategy)


module.exports = router;