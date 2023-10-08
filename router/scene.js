const express = require('express')
const router = express.Router()
const sceneHandler = require('../router_handler/scene')
const { upload } = require('../common/utils.js')


// 小程序接口 
router.post('/scene', sceneHandler.getScene)
router.get('/swiper', sceneHandler.getSwiper)
router.post('/search', sceneHandler.search_scene)
router.post('/billboard', sceneHandler.get_billboard)
router.post('/ticketpayment', sceneHandler.ticketPayment)


// 后台管理系统调用的接口
router.post('/scenery', sceneHandler.back_getScenery)
router.get('/scenelist', sceneHandler.back_sceneList)
router.post('/ticket', sceneHandler.back_getTickets)
router.post('/addticket', sceneHandler.back_addTicket)
router.post('/editticket', sceneHandler.back_editTicket)
router.post('/deleteticket', sceneHandler.back_deleteTicket)

router.post('/ticketonsale', sceneHandler.back_TicketOnSale)
router.post('/upload/image', upload.single('file'), sceneHandler.postImage)
router.post('/upload/scenery', sceneHandler.addScenery)
router.post('/add/scenery', sceneHandler.editScenery)
router.post('/sceneryopen', sceneHandler.back_SceneryOpen)
router.post('/deletescenery', sceneHandler.back_deleteScenery)


module.exports = router;