const db = require('../db/index')
const request = require('request')
const { ResultCodeEnum, TABLE } = require('../common/constant.js')




exports.get_route = (req, res) => {
  const sql = `select * from ${TABLE.TourRoute}`
  db.query(sql, (err, results) => {
    res.send({
      code: ResultCodeEnum.SUCCESS,
      msg: "获取路线成功！",
      data: results,
    })
  })
}

