const express = require('express')
const router = express.Router()
const userHandler = require('../router_handler/user')
const { upload } = require('../common/utils.js')

// 小程序接口
router.post('/user', userHandler.user)
router.post('/wxuser', userHandler.wxUser)
router.post('/getwxauth', userHandler.wxAuth)
router.post('/storewxuser', userHandler.storeWxUser)
router.post('/updateinfo', userHandler.updateUserInfo)
router.post('/avatar', upload.single('file'), userHandler.postAvatar)
router.post('/register', userHandler.register)
router.post('/login/miniapp', userHandler.login)


// 获取用户列表
router.get('/author', userHandler.getUserList)


// 后台管理系统的接口
router.post('/login', userHandler.back_login)
router.post('/logout', userHandler.back_logout)
router.post('/user/list', userHandler.back_getUserList)
router.post('/changepwd', userHandler.changePassword)
router.post('/changeusername', userHandler.changeUsername)
router.post('/userauth', userHandler.back_updateUserInfo)



module.exports = router;

