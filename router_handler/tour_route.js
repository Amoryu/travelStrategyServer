const db = require('../db/index')
const { RESULT_CODE, TABLE } = require('../common/constant.js')

exports.get_route = (req, res) => {
  const sql = `select * from ${TABLE.TourRoute}`
  db.query(sql, (err, results) => {
    res.send({
      code: RESULT_CODE.SUCCESS,
      msg: "获取路线成功！",
      data: results,
    })
  })
}

