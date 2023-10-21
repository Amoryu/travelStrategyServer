const db = require('../db/index');
const uuid = require('node-uuid')
const { RESULT_CODE, TABLE } = require('../common/constant.js')
const config = require('../config.js')
const fs = require('fs');
const {
  deleteLastPicture
} = require('../common/utils')


exports.search_scene = (req, res) => {
  // console.log(req.body)
  const keyword = "%" + req.query.search + "%"
  const sql = `select * from ${TABLE.Scenery} where name like ?`
  // console.log(keyword)

  db.query(sql, keyword, (err, results) => {
    // console.log(err, results)
    if (err) return res.send(err);
    if (results.length) {
      res.send({
        data: {
          code: RESULT_CODE.SUCCESS,
          data: results,
          msg: "搜索成功！"
        }
      })
    } else {
      res.send({
        data: {
          code: 400,
          msg: "搜索失败！"
        }
      })
    }
  })

}

exports.getScenery = (req, res) => {
  let sql = `select * from ${TABLE.Scenery} where province = "${req.query.province}" `


  if (req.query.city && req.query.city !== '') {
    sql = sql + `and city = "${req.query.city}" `
  }
  if (req.query.area && req.query.area !== '') {
    sql = sql + `and area = "${req.query.area}"`
  }

  db.query(sql, (err, results) => {
    // console.log(err, results)
    results = results.map(item => ({ ...item, isOpen: item.isOpen ? true : false }))
    res.send({
      code: RESULT_CODE.SUCCESS,
      msg: "后台管理系统_获取景点列表成功",
      data: results
    })
  })
}

exports.addScenery = (req, res) => {
  // console.log(req.body)
  const insertObj = {
    id: uuid.v4(),
    ...req.body,
    isOpen: 1,
    rank: 0
  }

  const sql = `insert ${TABLE.Scenery} set ?`

  db.query(sql, insertObj, (err, results) => {
    // console.log(err, results)
    if (err) return res.send(err);
    if (results.affectedRows !== 1) return res.send({
      code: 500,
      msg: "后台管理系统-添加景点失败！"
    });
    return res.send({
      code: RESULT_CODE.SUCCESS,
      data: insertObj,
      msg: "后台管理系统-添加景点成功"
    });
  })

}

exports.editScenery = (req, res) => {
  console.log(req.body)
  const id = req.body.id

  let lastPicture = null
  db.query(`select image from ${TABLE.Scenery} where id="${id}"`, (err, results) => {

    !!results.length && deleteLastPicture(results[0].image)

    const {
      name,
      description,
      province,
      city,
      area,
      provinceName,
      cityName,
      areaName,
      image,
      isOpen,
      address,
    } = req.body

    const field = `name="${name}",` +
      `description="${description}",` +
      `province="${province}",` +
      `city="${city}",` +
      `area="${area}",` +
      `provinceName="${provinceName}",` +
      `cityName="${cityName}",` +
      `areaName="${areaName}",` +
      `image="${image}",` +
      `isOpen=${isOpen},` +
      `address="${address}"`

    // console.log(updateObj)
    const sql = `update ${TABLE.Scenery} set ${field} where id = "${id}"`
    db.query(sql, (err, results) => {
      console.log(err, results)
      res.send({
        code: RESULT_CODE.SUCCESS,
        msg: "更新景点信息成功",
        data: results
      })
    })

  })
}

exports.SceneryOpen = (req, res) => {
  // console.log(req.body)
  let isOpen = req.body.isOpen ? 1 : 0
  let sql = `update ${TABLE.Scenery} set isOpen = ? where name = "${req.body.name}"`

  db.query(sql, isOpen, (err, results) => {
    // console.log(err, results)

    res.send({
      code: RESULT_CODE.SUCCESS,
      msg: isOpen ? "景点开放成功" : '景区暂停开放',
      data: results
    })
  })
}

exports.getAllScenery = (req, res) => {
  let sql = `select * from ${TABLE.Scenery} `


  if (req.query.sceneryName) {
    sql += `where name = "${req.query.sceneryName}"`
  }

  db.query(sql, (err, results) => {
    results = results.map(item => ({ ...item, isOpen: item.isOpen ? true : false }))
    res.send({
      code: RESULT_CODE.SUCCESS,
      msg: "后台管理系统_获取景点列表成功",
      data: results
    })
  })
}

exports.getTickets = (req, res) => {
  // console.log(req.body)
  let sql = `select * from ${TABLE.Ticket} `

  if (req.query.sceneName) {
    sql += `where sceneName = "${req.query.sceneName}" `
  }

  db.query(sql, (err, results) => {
    // console.log(err, results)

    results = results.map(item => ({ ...item, onSale: item.onSale ? true : false }))
    res.send({
      code: RESULT_CODE.SUCCESS,
      msg: "获取该景点的门票成功",
      data: results
    })
  })
}

exports.addTicket = (req, res) => {
  // console.log(req.body)

  const regionData = req.body.region

  const insertObj = {
    ...req.body,
    onSale: 1,
    sold: 0,
    id: uuid.v4(),
  }

  const sql = `insert ${TABLE.Ticket} set ?`

  db.query(sql, insertObj, (err, results) => {
    if (err) return res.send(err);
    if (results.affectedRows !== 1) return res.send({
      code: 500,
      msg: "后台管理系统-添加门票失败！"
    });
    return res.send({
      code: RESULT_CODE.SUCCESS,
      data: insertObj,
      msg: "后台管理系统-添加门票成功"
    });
  })
}

exports.editTicket = (req, res) => {
  const id = req.body.id
  const updateObj = {
    ...req.body,
  }
  delete updateObj.id

  const field = 'name=?, ' +
    'type=?, ' +
    'price=?, ' +
    'onSale=?, ' +
    'description=?, ' +
    'sceneName=?, ' +
    'sold=?'

  // console.log(updateObj)
  const sql = `update ${TABLE.Ticket} set ${field} where id = "${id}"`
  db.query(sql, Object.values(updateObj), (err, results) => {
    // console.log(err, results)
    res.send({
      code: RESULT_CODE.SUCCESS,
      msg: "更新门票信息成功",
      data: results
    })
  })
}

exports.TicketOnSale = (req, res) => {
  // console.log(req.body)
  let onSale = req.body.onSale ? 1 : 0
  let sql = `update ${TABLE.Ticket} set onSale = ? where area = "${req.body.area}" and name = "${req.body.name}" `

  db.query(sql, onSale, (err, results) => {
    // console.log(err, results)

    res.send({
      code: RESULT_CODE.SUCCESS,
      msg: onSale ? "已上架该门票" : '已下架该门票',
      data: results
    })
  })
}

exports.deleteScenery = (req, res) => {
  // console.log(req.body)
  const sql = `delete from ${TABLE.Scenery} where id="${req.query.id}"`

  db.query(sql, (err, results) => {
    // console.log(err, results)
    res.send({
      code: RESULT_CODE.SUCCESS,
      msg: "删除景点成功",
      data: results
    })
  })
}

exports.deleteTicket = (req, res) => {
  // console.log(req.body)

  const sql = `delete from ${TABLE.Ticket} where id="${req.query.id}"`

  db.query(sql, (err, results) => {
    // console.log(err, results)
    res.send({
      code: RESULT_CODE.SUCCESS,
      msg: "删除门票成功",
      data: results
    })
  })
}