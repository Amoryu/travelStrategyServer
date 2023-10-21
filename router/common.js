const express = require('express')
const router = express.Router()
const commonHandler = require('../router_handler/common')
const { upload } = require('../common/utils.js')


router.get('/curArea', commonHandler.getCurArea)
router.post('/curArea', commonHandler.changeCurArea)
router.post('/image', upload.single('file'), commonHandler.uploadImage)
router.get('/swiper', commonHandler.getSwiper)
router.get('/billboard', commonHandler.get_billboard)


module.exports = router;