const db = require('../db/index');
const uuid = require('node-uuid')
const { ResultCodeEnum, TABLE } = require('../common/constant.js')


exports.getHotelList = (req, res) => {
  console.log(req.body)
  let sql = `select * from ${TABLE.Hotel} `

  if (req.body.hotelName) {
    sql += `where name = "${req.body.hotelName}"`
  }

  db.query(sql, (err, results) => {
    res.send({
      code: ResultCodeEnum.SUCCESS,
      msg: "获取酒店列表成功",
      data: results
    })
  })

}

exports.roomPayment = (req, res) => {
  // console.log("roompayment", req.body)
  const sql = `insert ${TABLE.Order} set ?`
  let now = new Date()
  const { roomDetail, checkCondition, userInfo } = req.body
  const insertObj = {
    orderNo: uuid.v4(),
    name: roomDetail.name,
    type: '酒店',
    amount: roomDetail.price,
    createTime: now.toLocaleDateString() + "：" + now.toLocaleTimeString(),
    state: 2,
    roomType: roomDetail.roomType,
    roomNo: roomDetail.roomNo,
    seller: roomDetail.hotelName,
    checkInTime: checkCondition.checkInRange[0],
    leaveTime: checkCondition.checkInRange[1],
    peopleNum: checkCondition.checkInNum,
    usertoken: userInfo.token,
    userwxtoken: userInfo.wxtoken,
    coverImg: roomDetail.coverImg
  }

  db.query(sql, insertObj, (err, results) => {
    // console.log(err, results)
    res.send({
      code: ResultCodeEnum.SUCCESS,
      msg: "提交订单成功",
      data: insertObj
    })
  })

}


exports.getRoom = (req, res) => {
  const sql = `select * from ${TABLE.Room} where name = "${req.body.name}" and roomType = "${req.body.type}"`

  db.query(sql, (err, results) => {
    // results = resuls.map(item => ({ ...item, isSpare: item.isSpare ? true: false }))
    console.log(err, results)
    res.send({
      code: ResultCodeEnum.SUCCESS,
      msg: "获取酒店成功",
      data: results
    })
  })
}

/**
 * 后台管理系统接口
 */
// 酒店信息
exports.back_getHotelInfo = (req, res) => {
  const sql = `select * from ${TABLE.Hotel} where managerName = "${req.body.manager}"`
  db.query(sql, (err, results) => {
    // console.log(results)
    if (results.length) {
      res.send({
        code: ResultCodeEnum.SUCCESS,
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

exports.back_editHotel = (req, res) => {
  const newHotelInfo = {
    ...req.body,
    pictureList: Array.isArray(req.body.pictureList)
      ? req.body.pictureList.join('|')
      : req.body.pictureList
  }
  const field = 'id=?, ' +
    'name=?, ' +
    'description=?, ' +
    'address=?, ' +
    'province=?,' +
    'city=?,' +
    'area=?,' +
    'provinceName=?,' +
    'cityName=?,' +
    'areaName=?,' +
    'phone=?, ' +
    'facility=?, ' +
    'roomType=?, ' +
    'checkTime=?, ' +
    'leaveTime=?, ' +
    'roomNumber=?, ' +
    'pictureList=? '

  console.log(newHotelInfo)
  const sql = `update ${TABLE.Hotel} set ${field} where id = "${req.body.id}"`
  db.query(sql, Object.values(newHotelInfo), (err, results) => {
    // console.log(err, results)
    if (err) return res.send({
      code: 400,
      msg: "更新酒店信息失败",
    })
    return res.send({
      code: ResultCodeEnum.SUCCESS,
      msg: "更新酒店信息成功",
      data: results
    })
  })

}

exports.back_addHotel = (req, res) => {
  // console.log(req.body)
  const newHotelInfo = {
    ...req.body.hotel,
    id: uuid.v4(),
    pictureList: Array.isArray(req.body.hotel.pictureList)
      ? req.body.hotel.pictureList.join('|')
      : req.body.hotel.pictureList,
    managerName: req.body.manager.username
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
      code: ResultCodeEnum.SUCCESS,
      msg: "添加酒店信息成功",
      data: results
    })
  })

}

// 房间管理
exports.back_getRoom = (req, res) => {
  const sql = `select * from ${TABLE.Room} where hotelName = "${req.body.hotelName}" `

  db.query(sql, (err, results) => {
    // results = resuls.map(item => ({ ...item, isSpare: item.isSpare ? true: false }))
    // console.log(err, results)
    res.send({
      code: ResultCodeEnum.SUCCESS,
      msg: "获取酒店成功",
      data: results
    })
  })
}

exports.back_addRoom = (req, res) => {
  // console.log(req.body)
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
        code: ResultCodeEnum.SUCCESS,
        data: insertObj,
        msg: "后台管理系统-添加房间成功"
      })
    })

  })

}

exports.back_editRoom = (req, res) => {
  const id = req.body.id
  const updateObj = {
    ...req.body,
  }
  delete updateObj.id
  delete updateObj.roomNo
  delete updateObj.checkTime
  delete updateObj.leaveTime
  delete updateObj.isSpare
  delete updateObj.hotelName

  const field =
    'name=?, ' +
    'description=?, ' +
    'price=?, ' +
    'coverImg=?, ' +
    'roomType=?'


  // console.log(updateObj)
  const sql = `update ${TABLE.Room} set ${field} where id = "${id}"`
  db.query(sql, Object.values(updateObj), (err, results) => {
    // console.log(err, results)
    res.send({
      code: ResultCodeEnum.SUCCESS,
      msg: "更新房间信息成功",
      data: results
    })
  })
}

exports.back_deleteRoom = (req, res) => {
  console.log(req.body)

  const sql = `delete from ${TABLE.Room} where id="${req.body.id}"`

  db.query(sql, (err, results) => {
    // console.log(err, results)
    res.send({
      code: ResultCodeEnum.SUCCESS,
      msg: "删除房间成功",
      data: results
    })
  })
}
