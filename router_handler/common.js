const db = require('../db/index');
const { ResultCodeEnum, TABLE } = require('../common/constant.js')

exports.getCurArea = (req, res) => {
  const sql = `select * from ${TABLE.CurArea}`

  db.query(sql, (err, results) => {
    console.log(err, results)
    res.send({
      code: ResultCodeEnum.SUCCESS,
      msg: "获取当前区域成功",
      data: results
    })
  })
}


exports.changeCurArea = (req, res) => {
  const sql = `update ${TABLE.CurArea} set province = ?, city =?, area = ? where id = 1`
  const currentArea = req.body

  console.log(currentArea)
  db.query(sql, [currentArea.province, currentArea.city, currentArea.area], (err, results) => {
    res.send({
      code: ResultCodeEnum.SUCCESS,
      msg: "切换当前区域成功",
      data: currentArea
    })
  })
}