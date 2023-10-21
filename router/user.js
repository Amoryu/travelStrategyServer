const express = require('express')
const router = express.Router()
const userHandler = require('../router_handler/user')



router.get('/wechat/auth', userHandler.wxAuth)
router.get('/user/search', userHandler.back_getUserList)
router.get('/users', userHandler.getUserList)
router.get('/user', userHandler.getUser)

router.post('/user/wechat', userHandler.WxUser)
router.post('/user/login', userHandler.login)
router.post('/user/logout', userHandler.logOut)

router.put('/user/info', userHandler.updateUserInfo)
router.put('/register', userHandler.register)
router.put('/user/role', userHandler.back_updateUserInfo)
router.put('/user/password', userHandler.changePassword)
router.put('/user/username', userHandler.changeUsername)

router.delete('/user', userHandler.back_deleteUser)



module.exports = router;

