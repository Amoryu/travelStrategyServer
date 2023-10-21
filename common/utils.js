const fs = require('fs')

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


const deleteLastPicture = (url) => {
  fs.unlink(`./uploads/${url.split('uploads/')[1]}`, (err) => {
    if (err) throw err;
    console.log(url.split('uploads/')[1] + '文件已删除');
  });
}


module.exports = {
  upload,
  deleteLastPicture
}