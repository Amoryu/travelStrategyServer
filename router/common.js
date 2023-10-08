const express = require('express')
const router = express.Router()
const commonHandler = require('../router_handler/common')


router.get('/curArea', commonHandler.getCurArea)
router.post('/curArea', commonHandler.changeCurArea)


module.exports = router;