const express = require('express')
const router = express.Router()
const sceneHandler = require('../router_handler/scene')
const { upload } = require('../common/utils.js')


// 景点
router.post('/scenery', sceneHandler.addScenery)
router.delete('/scenery', sceneHandler.deleteScenery)
router.put('/scenery', sceneHandler.editScenery)
router.get('/scenery', sceneHandler.getScenery)

router.get('/scenery/search', sceneHandler.search_scene)
router.put('/scenery/open', sceneHandler.SceneryOpen)
router.get('/scenery/all', sceneHandler.getAllScenery)

//门票
router.get('/ticket', sceneHandler.getTickets)
router.post('/ticket', sceneHandler.addTicket)
router.put('/ticket', sceneHandler.editTicket)
router.delete('/ticket', sceneHandler.deleteTicket)

router.post('/ticketonsale', sceneHandler.TicketOnSale)




module.exports = router;