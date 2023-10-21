const db = require('../db/index')
const request = require('request')
// const jwt = require('jsonwebtoken')
const config = require('../config')
const uuid = require('node-uuid')
const md5 = require('js-md5')
const fs = require('fs')
const path = require('path')
const { RESULT_CODE, TABLE, APPLET } = require('../common/constant.js')
const {
  deleteLastPicture
} = require('../common/utils')

exports.login = (req, res) => {
  // console.log(req.body)
  const sql = `select * from ${TABLE.User} where ${req.body.mode === 'wechat' ? 'wxtoken' : 'username'} ="${req.body.token}"`

  db.query(sql, (err, results) => {
    // console.log(err, results)
    res.status(200).send({
      code: RESULT_CODE.SUCCESS,
      msg: "登录成功",
      data: results[0]
    })
  })

}
// 注册账号
exports.register = (req, res) => {
  // console.log(req.body, path.dirname)

  const newUserInfo = {
    id: uuid.v1(),
    ...req.body,
    name: '游客' + req.body.token.substr(3, 7),
    address: '',
    signature: '暂时还没有签名',
    avatar: config.baseURL + '/uploads/defaultAvatar.jpg',
    gender: 1,
  }
  const sql = `insert ${TABLE.User} set ?`
  db.query(sql, newUserInfo, (err, results) => {
    if (err) return res.send(err);
    if (results.affectedRows !== 1) return res.send({
      code: 400,
      msg: "注册失败,请稍后重试"
    });
    return res.send({
      code: RESULT_CODE.SUCCESS,
      msg: "注册成功！",
      data: newUserInfo,
    });
  })
}
// 根据token或username获取用户信息 （账号密码登录的用户）
exports.getUser = (req, res) => {
  let sql = `select * from ${TABLE.User} `

  if (req.query.token) {
    sql += `where token ="${req.query.token}"`
  }
  if (req.query.userName) {
    sql += `where username ="${req.query.userName}"`
  }

  db.query(sql, (err, results) => {

    res.status(200).send({
      code: RESULT_CODE.SUCCESS,
      msg: "登录成功！",
      data: results[0],
    })
  })
}
// 微信登录授权
exports.wxAuth = (req, res) => {
  // console.log(req.body)

  const url = 'https://api.weixin.qq.com/sns/jscode2session?'
    + 'appid=' + APPLET.appid
    + '&secret=' + APPLET.secret
    + '&js_code=' + req.query.code
    + '&grant_type=authorization_code'

  request(url, (err, response, body) => {
    let session = JSON.parse(body)
    if (session.openid) {
      // 查询数据库，无则插入，有则返回用户信息
      db.query(`select * from ${TABLE.User} where wxtoken ="${md5(session.openid)}"`, (err, results) => {
        if (results.length !== 0) {   //有该用户则返回用户信息,（已经授权登录）
          return res.send({
            code: RESULT_CODE.SUCCESS,
            msg: "登录成功",
            data: results
          });
        } else {  //没有该用户则在用户表插入该微信用户
          let random = uuid.v4().substr(0, 11)
          const WxUserInfo = {
            id: uuid.v4(),
            username: random,
            password: '111111',
            token: md5(random),
            name: '微信用户',
            address: '',
            signature: '暂时还没有签名',
            avatar: '',
            gender: 1,
            wxtoken: md5(session.openid)
          }
          db.query(`insert ${TABLE.User} set ?`, WxUserInfo, (err, result) => {
            // console.log(err, result)
            if (err) return res.send(err);
            if (result.affectedRows !== 1) return res.send({
              code: 400,
              msg: "注册失败,请稍后重试"
            });
            return res.send({
              code: RESULT_CODE.SUCCESS,
              msg: "注册成功！即将跳转登录",
              data: WxUserInfo,
            })
          })
        }
      })
    } else {
      return res.send({
        code: 400,
        msg: "注册失败,请稍后重试"
      });
    }
  })

}
// 使用微信授权注册用户
exports.WxUser = (req, res) => {
  // console.log(req.body)
  let userInfo = req.body

  const sql = `update ${TABLE.User} set name = ?, avatar = ? where wxtoken="${userInfo.wxtoken}"`

  db.query(sql, [userInfo.name, userInfo.avatar], (err, results) => {
    if (results.affectedRows !== 1) return res.send({
      code: 400,
      msg: "登录失败,请稍后重试"
    });
    return res.send({
      code: RESULT_CODE.SUCCESS,
      msg: "登录成功！即将跳转登录",
      data: userInfo,
    })
  })
}
// 更新用户信息
exports.updateUserInfo = (req, res) => {
  // console.log(req.body)
  const { username, name, avatar, address, phone, gender, signature } = req.body

  let lastPicture = null;
  db.query(`select avatar from ${TABLE.User} where username = "${username}"`, (err, results) => {

    !!results.length && deleteLastPicture(results[0].avatar)

    const sql = `update ${TABLE.User} set name = ?, avatar = ?,address = ?,phone = ?,gender = ?,signature = ? where username = "${username}"`
    db.query(sql, [name, avatar, address, phone, gender, signature], (err, results) => {
      if (results.affectedRows === 1) {
        res.send({
          code: RESULT_CODE.SUCCESS,
          data: results,
          msg: '修改用户资料成功',
        })
      } else {
        res.send({
          code: 400,
          msg: '修改用户资料失败',
        })
      }
    })
  })
}

// 获取用户列表
exports.getUserList = (req, res) => {
  db.query(`select * from ${TABLE.User} `, (err, results) => {
    res.send({
      code: RESULT_CODE.SUCCESS,
      msg: "获取用户列表成功",
      data: results,
    })
  })
}



exports.logOut = (req, res) => {
  // console.log(req.body)
  res.send({
    code: RESULT_CODE.SUCCESS,
    logout: true
  })
}

exports.back_getUserList = (req, res) => {
  // console.log(req.body)
  // console.log(req.query)
  const searchRole = req.query.role
  const keyword = "%" + req.query.name + "%"

  let sql = `select * from ${TABLE.User} where name like ? `

  if (searchRole !== 'all') {
    sql += `and role = "${searchRole}"`
  }

  db.query(sql, keyword, (err, results) => {
    res.send({
      code: RESULT_CODE.SUCCESS,
      msg: "获取用户列表成功",
      data: results,
    })
  })

}

exports.changePassword = (req, res) => {
  // console.log(req.body)
  const sql = `select * from ${TABLE.User} where username="${req.body.userInfo.username}"`
  db.query(sql, (err, results) => {
    // console.log(results)
    if (results[0].password !== req.body.passwordForm.originPwd) {
      return res.send({
        code: 404,
        msg: '旧密码输入错误',
      })
    } else {

      const sql = `update ${TABLE.User} set password = ? where username="${req.body.userInfo.username}"`
      db.query(sql, req.body.passwordForm.newPwd, (err, results) => {
        if (results.affectedRows === 1) {
          res.send({
            code: RESULT_CODE.SUCCESS,
            data: results,
            msg: '修改密码成功',
          })
        } else {
          res.send({
            code: 404,
            msg: '修改密码失败',
          })
        }
      })

    }

  })

}

exports.changeUsername = (req, res) => {
  // console.log(req.body)
  const { username, token, wxtoken } = req.body.userInfo

  const sql = `update ${TABLE.User} set username = ? where token = "${token}" or wxtoken ="${wxtoken}"`
  db.query(sql, username, (err, results) => {
    if (err) return res.send({
      code: 404,
      msg: '该用户名已被使用',
    })
    if (results.affectedRows === 1) {
      res.status(202).send({
        code: RESULT_CODE.SUCCESS,
        data: username,
        msg: '修改用户名成功',
      })
    } else {
      res.status(400).send({
        code: 400,
        msg: '修改用户名失败',
      })
    }
  })


}

// 更新用户信息
exports.back_updateUserInfo = (req, res) => {
  // console.log(req.body)
  const { username, role } = req.body
  const sql = `update ${TABLE.User} set role = ? where username = "${username}"`
  db.query(sql, role, (err, results) => {
    if (results.affectedRows === 1) {
      res.send({
        code: RESULT_CODE.SUCCESS,
        data: results,
        msg: '修改用户权限成功',
      })
    } else {
      res.send({
        code: 400,
        msg: '修改用户权限失败',
      })
    }
  })
}

exports.back_deleteUser = (req, res) => {
  // console.log(req.query)

  db.query(`delete from ${TABLE.User} where username = "${req.query.username}"`, (err, results) => {
    if (results.affectedRows === 1) {
      res.send({
        code: RESULT_CODE.SUCCESS,
        data: results,
        msg: '已删除该用户',
      })
    } else {
      res.send({
        code: 400,
        msg: '删除该用户失败',
      })
    }
  })

}
