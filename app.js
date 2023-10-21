const express = require('express')
const config = require('./config')
const app = express()

// 配置代理跨域
const cors = require('cors')
app.use(cors())

// 解析接收的params参数
app.use(express.urlencoded({ extended: true }))
app.use(express.json());

// 配置JWT
// const { expressjwt: expressJWT } = require('express-jwt')
// app.use(expressJWT({ secret: config.jwtSecretKey, algorithms: ["HS256"] }).unless({ path: [/^\/api\//] }))

// 导入路由
const userRouter = require('./router/user')
const strategyRouter = require('./router/strategy')
const sceneRouter = require('./router/scene')
const orderRouter = require('./router/order')
const commonRouter = require('./router/common')
const hotelRouter = require('./router/hotel')
const tourRouteHandler = require('./router/tour_route')


app.use('/api', userRouter)
app.use('/api', strategyRouter)
app.use('/api', sceneRouter)
app.use('/api', orderRouter)
app.use('/api', commonRouter)
app.use('/api', hotelRouter)
app.use('/api', tourRouteHandler)
app.use('/uploads', express.static('uploads'))


app.listen(config.PORT, () => {
  console.log('旅游攻略管理系统服务器已启动在' + config.baseURL);
})