const express = require('express')
const router = express.Router()
const tourRouteHandler = require('../router_handler/tour_route')

router.get('/route', tourRouteHandler.get_route)


module.exports = router;