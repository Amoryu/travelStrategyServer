const express = require('express')
const router = express.Router()
const hotelHandler = require('../router_handler/hotel')



router.post('/hotel', hotelHandler.addHotel)
router.delete('/hotel', hotelHandler.deleteHotel)
router.put('/hotel', hotelHandler.editHotel)
router.get('/hotel', hotelHandler.getHotel)

router.post('/room', hotelHandler.addRoom)
router.delete('/room', hotelHandler.deleteRoom)
router.put('/room', hotelHandler.editRoom)
router.get('/room', hotelHandler.getRoom)



module.exports = router;