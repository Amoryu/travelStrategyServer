const db = require('../db/index');
const { RESULT_CODE, TABLE } = require('../common/constant.js')
const config = require('../config')

exports.getSwiper = (req, res) => {
  db.query(`select * from ${TABLE.Swiper}`, (err, results) => {
    res.send({
      status: 0,
      msg: "获取轮播图成功",
      data: results
    })
  })
}


exports.get_billboard = (req, res) => {
  // console.log(req.body)

  const sql = `select * from ${TABLE.Scenery} where scene_area = "${req.query.city}"`

  db.query(sql, (err, results) => {
    // console.log(err, results)
    if (err) return res.send(err);
    if (results.length) {
      res.send({
        code: 1,
        data: results,
        msg: "获取排行榜成功！"
      })
    } else {
      res.send({
        data: {
          code: 0,
          msg: "获取排行榜失败！"
        }
      })
    }
  })
}

exports.uploadImage = (req, res) => {
  // console.log(req.file)
  res.send({
    code: RESULT_CODE.SUCCESS,
    coverImg: config.baseURL + '/uploads/' + req.file.filename,
  })
}


exports.getCurArea = (req, res) => {
  const sql = `select * from ${TABLE.CurArea}`

  db.query(sql, (err, results) => {
    // console.log(err, results)
    res.send({
      code: RESULT_CODE.SUCCESS,
      msg: "获取当前区域成功",
      data: results
    })
  })
}


exports.changeCurArea = (req, res) => {
  const sql = `update ${TABLE.CurArea} set province = ?, city =?, area = ? where id = 1`
  const currentArea = req.body

  // console.log(currentArea)
  db.query(sql, [currentArea.province, currentArea.city, currentArea.area], (err, results) => {
    res.send({
      code: RESULT_CODE.SUCCESS,
      msg: "切换当前区域成功",
      data: currentArea
    })
  })
}
