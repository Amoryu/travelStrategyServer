const db = require('../db/index');
const uuid = require('node-uuid')
const { ResultCodeEnum, TABLE } = require('../common/constant.js')



exports.get_shopCart = (req, res) => {
  console.log(req.body)
  const sql = `select * from ${TABLE.ShopCart} where usertoken = "${req.body.userToken}" or userwxtoken = "${req.body.userWxtoken}"`

  db.query(sql, (err, results) => {
    console.log(err, results)
    const data = [
      { name: 'ticket', list: [] },
      { name: 'hotel', list: [] },
    ]
    results.forEach(item => {
      switch (item.type) {
        case '门票':
          data[0].list.push(item)
          break;
        case '酒店':
          data[1].list.push(item)
          break;
      }
    })
    res.send({
      code: ResultCodeEnum.SUCCESS,
      msg: "获取购物车列表成功",
      data
    })
  })

}

exports.add_shopCart = (req, res) => {
  const sql = `insert ${TABLE.ShopCart} set ?`
  let now = new Date()
  let insertObj = {}
  if (req.body.type === '门票') {
    const ticket = req.body.ticket
    console.log(ticket)
    const scenery = req.body.scenery
    const userInfo = req.body.userInfo
    insertObj = {
      orderNo: uuid.v4(),
      name: ticket.name,
      type: '门票',
      price: ticket.amount,
      createTime: now.toLocaleDateString() + "：" + now.toLocaleTimeString(),
      state: 2,
      seller: scenery.name,
      peopleNum: req.body.ticketNum,
      usertoken: userInfo.token,
      userwxtoken: userInfo.wxtoken,
      coverImg: scenery.image,
      bookDay: req.body.day,
      bookSession: req.body.session,
      count: req.body.ticketNum
    }
  } else {
    const { roomDetail, checkCondition, userInfo } = req.body
    insertObj = {
      orderNo: uuid.v4(),
      name: roomDetail.name,
      type: '酒店',
      price: roomDetail.price,
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
  }
  // console.log(insertObj)

  db.query(sql, insertObj, (err, results) => {
    console.log(err, results)
    res.send({
      code: ResultCodeEnum.SUCCESS,
      msg: "加入购物车成功",
      data: insertObj
    })
  })

}

exports.get_order = (req, res) => {
  // console.log(req.body)
  const sql = `select * from ${TABLE.Order} where usertoken = "${req.body.userToken}" or userwxtoken = "${req.body.userWxtoken}"`
  db.query(sql, (err, results) => {
    res.send({
      code: ResultCodeEnum.SUCCESS,
      msg: "获取订单列表成功",
      data: results
    })
  })
}


exports.back_getOrder = (req, res) => {
  const sql = `select * from ${TABLE.Order}`
  db.query(sql, (err, results) => {
    res.send({
      code: ResultCodeEnum.SUCCESS,
      msg: "获取订单列表成功",
      data: results
    })
  })
}

exports.back_editOrder = (req, res) => {
  const sql = `select * from ${TABLE.Order}`
  db.query(sql, (err, results) => {
    res.send({
      code: ResultCodeEnum.SUCCESS,
      msg: "获取订单列表成功",
      data: results
    })
  })
}