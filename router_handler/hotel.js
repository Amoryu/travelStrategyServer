const db = require('../db/index');
const uuid = require('node-uuid')
const { RESULT_CODE, TABLE } = require('../common/constant.js')
const fs = require('fs')
const {
  deleteLastPicture
} = require('../common/utils')


exports.addHotel = (req, res) => {
  console.log(req.body)
  const newHotelInfo = {
    ...req.body.hotel,
    id: uuid.v4(),
    pictureList: Array.isArray(req.body.hotel.pictureList)
      ? req.body.hotel.pictureList.join('|')
      : req.body.hotel.pictureList,
    managerName: ""
  }

  // console.log(newHotelInfo)
  const sql = `insert ${TABLE.Hotel} set ?`


  db.query(sql, newHotelInfo, (err, results) => {
    // console.log(err, results)
    if (err) return res.send({
      code: 400,
      msg: "添加酒店信息失败",
    })
    return res.send({
      code: RESULT_CODE.SUCCESS,
      msg: "添加酒店信息成功",
      data: results
    })
  })

}
exports.deleteHotel = (req, res) => {
  // console.log(req.body)

  const sql = `delete from ${TABLE.Hotel} where id="${req.query.id}"`

  db.query(sql, (err, results) => {
    // console.log(err, results)
    res.send({
      code: RESULT_CODE.SUCCESS,
      msg: "删除酒店成功",
      data: results
    })
  })
}
exports.editHotel = (req, res) => {
  console.log(req.body)

  const {
    id,
    name,
    description,
    address,
    province,
    city,
    area,
    provinceName,
    cityName,
    areaName,
    phone,
    facility,
    roomType,
    checkTime,
    leaveTime,
    roomNumber,
    pictureList
  } = req.body
  const field = `id="${id}",` +
    `name="${name}",` +
    `description="${description}",` +
    `address="${address}",` +
    `province="${province}",` +
    `city="${city}",` +
    `area="${area}",` +
    `provinceName="${provinceName}",` +
    `cityName="${cityName}",` +
    `areaName="${areaName}",` +
    `phone="${phone}",` +
    `facility="${facility}",` +
    `roomType="${roomType}",` +
    `checkTime="${checkTime}",` +
    `leaveTime="${leaveTime}",` +
    `roomNumber=${roomNumber},` +
    `pictureList="${pictureList}"`

  db.query(`select pictureList from ${TABLE.Hotel} where id = "${id}"`, (err, results) => {
    // console.log(results)

    if (!!results.length) {
      lastPicture = results[0].pictureList.split("|")
      lastPicture.forEach(pic => deleteLastPicture(pic));
      // console.log(newHotelInfo)

      const sql = `update ${TABLE.Hotel} set ${field} where id = "${req.body.id}"`
      db.query(sql, (err, results) => {
        console.log(err, results)
        if (err) return res.send({
          code: 400,
          msg: "更新酒店信息失败",
        })
        return res.send({
          code: RESULT_CODE.SUCCESS,
          msg: "更新酒店信息成功",
        })
      })
    }
  })

}
exports.getHotel = (req, res) => {
  let sql = `select * from ${TABLE.Hotel} `
  if (req.query.manager) {
    sql += `where managerName = "${req.query.manager}"`
  }

  if (req.query.hotelName) {
    sql += `where name = "${req.query.hotelName}"`
  }

  db.query(sql, (err, results) => {
    // console.log(results)
    if (results.length) {
      res.send({
        code: RESULT_CODE.SUCCESS,
        msg: "获取酒店成功",
        data: results
      })
    } else {
      res.send({
        code: 404,
        msg: "没有酒店数据",
        data: results
      })
    }

  })
}



exports.addRoom = (req, res) => {
  console.log(req.body)
  const searchSql = `select * from ${TABLE.Hotel} where name = "${req.body.hotelName}"`

  db.query(searchSql, (err, results) => {
    // console.log(results)
    const insertObj = {
      id: uuid.v4(),
      ...req.body.roomInfo,
      hotelName: req.body.hotelName,
      checkTime: results[0].checkTime,
      leaveTime: results[0].leaveTime,
      isSpare: 1
    }
    // console.log(insertObj)

    const sql = `insert ${TABLE.Room} set ?`

    db.query(sql, insertObj, (err, results) => {
      // console.log(err, results)
      if (err) return res.send(err);
      if (results.affectedRows !== 1) return res.send({
        code: 500,
        msg: "后台管理系统-添加房间失败！"
      })
      return res.send({
        code: RESULT_CODE.SUCCESS,
        data: insertObj,
        msg: "后台管理系统-添加房间成功"
      })
    })

  })

}
exports.deleteRoom = (req, res) => {
  const sql = `delete from ${TABLE.Room} where id="${req.query.id}"`

  db.query(sql, (err, results) => {
    // console.log(err, results)
    res.send({
      code: RESULT_CODE.SUCCESS,
      msg: "删除房间成功",
      data: results
    })
  })
}
exports.editRoom = (req, res) => {
  const id = req.body.id

  console.log(req.body)
  const {
    name,
    description,
    price,
    coverImg,
    roomType,
  } = req.body

  const field = `name="${name}",` +
    `description="${description}",` +
    `price="${price}",` +
    `coverImg="${coverImg}",` +
    `roomType="${roomType}"`

  // console.log(updateObj)
  const sql = `update ${TABLE.Room} set ${field} where id = "${id}"`
  db.query(sql, (err, results) => {
    // console.log(err, results)
    res.send({
      code: RESULT_CODE.SUCCESS,
      msg: "更新房间信息成功",
      data: results
    })
  })
}
exports.getRoom = (req, res) => {
  let sql = `select * from ${TABLE.Room} `

  if (req.query.hotelName) {
    sql += `where hotelName = "${req.query.hotelName}" `
  }

  if (req.query.name && req.query.type) {
    sql += `where name = "${req.query.name}" and roomType = "${req.query.type}"`
  }


  db.query(sql, (err, results) => {
    res.send({
      code: RESULT_CODE.SUCCESS,
      msg: "获取酒店成功",
      data: results
    })
  })
}



