const db = require('../db/index');
const path = require('path')
const fs = require('fs')
const uuid = require('node-uuid')
const { RESULT_CODE, TABLE } = require('../common/constant.js')
const config = require('../config')
const {
  deleteLastPicture
} = require('../common/utils')

//收藏相关
exports.get_collectStrategy = (req, res) => {
  // console.log(req.body, TABLE.Collection)
  const sql = `select * from ${TABLE.Strategy} where id in (select strategy_id from ${TABLE.Collection} where username = "${req.query.username}")`
  db.query(sql, (err, results) => {
    // console.log(err, results)
    res.send({
      code: RESULT_CODE.SUCCESS,
      msg: "获取收藏夹成功",
      data: results
    })
  })
}

exports.getCollectState = (req, res) => {
  // console.log(req.body)
  const sql = `select * from ${TABLE.Collection} where username = "${req.query.username}" and strategy_id = "${req.query.strategy_id}"`
  db.query(sql, (err, results) => {
    // console.log(err, results)
    const state = results.length !== 0
    res.send({
      code: state ? RESULT_CODE.SUCCESS : RESULT_CODE.Error,
      msg: state ? "该文章被收藏" : "该文章未被收藏",
      data: state,
    })
  })
}

exports.collectStrategy = (req, res) => {
  // console.log(req.body)
  const { strategy_id, username, isCollect } = req.body
  let sql = `insert ${TABLE.Collection} set ?`

  if (isCollect) {
    const insertObj = {
      strategy_id,
      username
    }
    db.query(sql, insertObj, (err, results) => {
      // console.log(err, results)
      res.send({
        code: RESULT_CODE.SUCCESS,
        msg: "收藏攻略成功",
        data: results
      })
    })
  } else {
    sql = `delete from ${TABLE.Collection} where strategy_id = "${req.body.strategy_id}"`
    db.query(sql, (err, results) => {
      // console.log(err, results)
      res.send({
        code: RESULT_CODE.SUCCESS,
        msg: "取消收藏攻略成功",
        data: results
      })
    })
  }
}


// 后台管理系统接口
// 攻略分类


exports.addStrategyCate = (req, res) => {
  // console.log(req.body)
  const insertObj = {
    id: uuid.v4(),
    ...req.body,
    isShow: 1
  }
  const sql = `insert ${TABLE.StrategyCategory} set ?`

  db.query(sql, insertObj, (err, results) => {
    if (err) return res.send(err);
    if (results.affectedRows !== 1) return res.send({
      code: RESULT_CODE.ERROR,
      msg: "添加攻略分类失败！"
    });
    return res.send({
      code: RESULT_CODE.SUCCESS,
      insertObj,
      msg: "添加攻略分类成功！"
    });
  })
}

exports.deleteStrategyCate = (req, res) => {
  // console.log(req.body)
  const sql = `delete from ${TABLE.StrategyCategory} where id="${req.query.id}"`

  db.query(sql, (err, results) => {
    // console.log(err, results)
    res.send({
      code: RESULT_CODE.SUCCESS,
      msg: "删除攻略分类成功",
      data: results
    })
  })
}

exports.editStrategyCate = (req, res) => {
  const id = req.body.id
  const updateObj = {
    ...req.body,
  }
  delete updateObj.id

  const field = 'name=?, ' +
    'description=?, ' +
    'isShow=? '

  // console.log(updateObj)
  const sql = `update ${TABLE.StrategyCategory} set ${field} where id = "${id}"`
  db.query(sql, Object.values(updateObj), (err, results) => {
    // console.log(err, results)
    res.send({
      code: RESULT_CODE.SUCCESS,
      msg: "更新攻略分类成功",
      data: results
    })
  })
}

exports.getStrategyCate = (req, res) => {
  const sql = `select * from ${TABLE.StrategyCategory}`

  db.query(sql, (err, results) => {
    results = results.map(item => ({ ...item, isShow: item.isShow ? true : false }))
    res.send({
      code: RESULT_CODE.SUCCESS,
      msg: "获取攻略分类成功",
      data: results
    })
  })
}

exports.setStrategyCateShow = (req, res) => {
  // console.log(req.body)
  let isShow = req.body.isShow ? 1 : 0
  let sql = `update ${TABLE.StrategyCategory} set isShow = ? where name = "${req.body.name}" `

  db.query(sql, isShow, (err, results) => {
    // console.log(err, results)

    res.send({
      code: RESULT_CODE.SUCCESS,
      msg: isShow ? "类型已展示" : "类型已关闭",
      data: results
    })
  })
}


// 攻略管理


exports.addStrategy = (req, res) => {
  // console.log(req.body)
  let date = new Date()
  const insertObj = {
    ...req.body,
    id: uuid.v4(),
    publishtime: `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`,
  }
  // console.log(insertObj)

  const sql = `insert ${TABLE.Strategy} set ?`

  db.query(sql, insertObj, (err, results) => {
    if (err) return res.send(err);
    if (results.affectedRows !== 1) return res.send({
      code: RESULT_CODE.Error,
      msg: "后台管理系统-添加攻略失败！"
    });
    return res.send({
      code: RESULT_CODE.SUCCESS,
      data: insertObj,
      msg: "后台管理系统-添加攻略成功"
    });
  })
}

exports.delete_strategy = (req, res) => {
  const id = req.body.id || req.query.id

  const sql = `delete from ${TABLE.Strategy} where id = "${id}"`

  db.query(sql, (err, results) => {
    console.log(sql, results)
    res.send({
      code: 200,
      msg: "删除攻略成功",
      data: results
    })
  })
}

exports.editStrategy = (req, res) => {
  const id = req.body.id

  const {
    title,
    content,
    coverImg,
    type,
    province,
    city,
    area,
    provinceName,
    cityName,
    areaName,
    duration,
    address,
    perCost,
  } = req.body


  db.query(`select coverImg from ${TABLE.Strategy} where id="${req.body.id}"`, (err, results) => {

    !!results.length && deleteLastPicture(results[0].coverImg)

    const field = `title="${title}",` +
      `content="${content}",` +
      `coverImg="${coverImg}",` +
      `type="${type}",` +
      `province="${province}",` +
      `city="${city}",` +
      `area="${area}",` +
      `provinceName="${provinceName}",` +
      `cityName="${cityName}",` +
      `areaName="${areaName}",` +
      `duration="${duration}",` +
      `address="${address}",` +
      `perCost="${perCost}"`

    // console.log(req.body)
    const sql = `update ${TABLE.Strategy} set ${field} where id = "${id}"`
    db.query(sql, (err, results) => {
      // console.log(err, results)
      res.send({
        code: RESULT_CODE.SUCCESS,
        msg: "更新攻略信息成功",
        data: req.body
      })
    })
  })
}


exports.getStrategy = (req, res) => {
  let sql = `select * from ${TABLE.Strategy} `
  if (req.query.id) {
    sql += `where id = "${req.query.id}"`
  }
  if (req.query.type) {
    sql += `where type = "${req.query.type}" `
  }
  if (req.query.userName) {
    sql += `where userName = "${req.query.userName}"`
  }

  db.query(sql, (err, results) => {
    res.send({
      // code: RESULT_CODE.SUCCESS,
      msg: "获取攻略成功",
      data: req.query.id ? results[0] : results
    })
  })
}




