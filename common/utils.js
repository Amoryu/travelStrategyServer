/* 处理 multipart/form-data 类型的表单数据，主要用于上传文件 */
const multer = require('multer')
const path = require('path')
const storage = multer.diskStorage({
  // 配置文件上传后存储的路径
  destination: function (req, file, cb) {
    // NodeJS的两个全局变量
    // console.log(__dirname);  //获取当前文件在服务器上的完整目录 
    // console.log(__filename); //获取当前文件在服务器上的完整路径 
    cb(null, path.join(__dirname, '../uploads'))
  },
  // 配置文件上传后存储的路径和文件名
  filename: function (req, file, cb) {
    // console.log('file', file);
    cb(null, Date.now() + path.extname(file.originalname))
  }
})
const upload = multer({ storage: storage })



//七牛云配置文件
const qiniu = require('qiniu')

// 创建上传凭证（accessKey 和 secretKey在七牛云个人中心中有，lytton是七牛云刚才创建的空间名称）
const accessKey = 'QJZnZVzBOCANx8sdc-WJ3-OIJoxNPk-tXEtTSVb2'
const secretKey = 'vNMu5HFw_rPBLO15wuL3nmUN79Ced-t5tznODyTN'
const mac = new qiniu.auth.digest.Mac(accessKey, secretKey)
const options = {
  scope: 'travel-server', //这是你创建存储空间的名子
  deadline: 1695523678 //这是七牛云生成token的有效期，单位时秒，不设置默认是3600S，一串数字是时间戳
}
const putPolicy = new qiniu.rs.PutPolicy(options)
const uploadToken = putPolicy.uploadToken(mac)


module.exports = {
  upload,
  uploadToken
}