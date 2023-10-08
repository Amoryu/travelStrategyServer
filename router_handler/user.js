const db = require('../db/index')
const request = require('request')
// const jwt = require('jsonwebtoken')
const config = require('../config')
const uuid = require('node-uuid')
const md5 = require('js-md5')
const fs = require('fs')
const path = require('path')
const { ResultCodeEnum, TABLE, Applet } = require('../common/constant.js')


/** 
 * 小程序的接口
 *  */
exports.login = (req, res) => {
  // console.log(req.body)

  const sql = `select * from ${TABLE.User} where username = "${req.body.userName}"`
  db.query(sql, (err, results) => {
    // console.log(err, results)
    res.send({
      code: ResultCodeEnum.SUCCESS,
      msg: "登录成功",
      data: {
        userInfo: results[0],
        access_token: results[0].role
      }
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
    // avatar: config.baseURL + ":" + config.PORT + '/uploads/' + 'defaultAvatar.jpg',
    avatar: config.baseURL + '/uploads/' + 'defaultAvatar.jpg',
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
      code: ResultCodeEnum.SUCCESS,
      msg: "注册成功！",
      data: newUserInfo,
    });
  })
}
// 根据token获取用户信息 （账号密码登录的用户）
exports.user = (req, res) => {
  const sql = `select * from ${TABLE.User} where token ="${req.body.token}"`
  db.query(sql, (err, results) => {

    const user = { ...results[0] }
    res.send({
      code: ResultCodeEnum.SUCCESS,
      msg: "登录成功！",
      user,
    })
  })
}
// 根据微信openid获取用户信息 （微信登录的用户）
exports.wxUser = (req, res) => {
  const sql = `select * from ${TABLE.User} where wxtoken ="${req.body.id}"`
  db.query(sql, (err, results) => {

    const user = { ...results[0] }
    res.send({
      status: 0,
      msg: "登录成功！",
      user,
    })
  })
}
// 微信登录授权
exports.wxAuth = (req, res) => {
  // console.log(req.body)

  const url = 'https://api.weixin.qq.com/sns/jscode2session?'
    + 'appid=' + Applet.appid
    + '&secret=' + Applet.secret
    + '&js_code=' + req.body.code
    + '&grant_type=authorization_code'

  request(url, (err, response, body) => {
    let session = JSON.parse(body)
    if (session.openid) {
      // 查询数据库，无则插入，有则返回用户信息
      db.query(`select * from ${TABLE.User} where wxtoken ="${md5(session.openid)}"`, (err, results) => {
        if (results.length !== 0) {   //有该用户则返回用户信息
          return res.send({
            code: ResultCodeEnum.SUCCESS,
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
              code: ResultCodeEnum.SUCCESS,
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
exports.storeWxUser = (req, res) => {
  // console.log(req.body)
  let userInfo = req.body

  const sql = `update ${TABLE.User} set name = ?, avatar = ? where wxtoken="${userInfo.wxtoken}"`

  db.query(sql, [userInfo.name, userInfo.avatar], (err, results) => {
    if (results.affectedRows !== 1) return res.send({
      code: 400,
      msg: "登录失败,请稍后重试"
    });
    return res.send({
      code: ResultCodeEnum.SUCCESS,
      msg: "登录成功！即将跳转登录",
      data: userInfo,
    })
  })
}
// 上传头像
exports.postAvatar = (req, res) => {
  // console.log("上传的东西呢", req.body.username)
  // console.log(req.file)
  let lastPicture = null
  db.query(`select avatar from ${TABLE.User} where username ="${req.body.username}"`, (err, results) => {
    // console.log(err, results)
    if (!!results.length) {
      lastPicture = results[0].coverImg
      fs.unlink(`./uploads/${lastPicture.split('uploads/')[1]}`, (err) => {
        // if (err) throw err;
        console.log(lastPicture.split('uploads/')[1] + '文件已删除');
      });
    }
  })
  res.send({
    code: ResultCodeEnum.SUCCESS,
    // avatar: config.baseURL + ":" + config.PORT + '/uploads/' + req.file.filename,
    avatar: config.baseURL + '/uploads/' + req.file.filename,
  })

}
// 更新用户信息
exports.updateUserInfo = (req, res) => {
  console.log(req.body)
  const { username, name, avatar, address, phone, gender, signature } = req.body

  let lastPicture = null
  db.query(`select avatar from ${TABLE.User} where username = "${username}"`, (err, results) => {
    console.log(results)
    if (!!results.length) {
      lastPicture = results[0].coverImg
      fs.unlink(`./uploads/${lastPicture.split('uploads/')[1]}`, (err) => {
        // if (err) throw err;
        console.log(lastPicture.split('uploads/')[1] + '文件已删除');
      });
    }

    const sql = `update ${TABLE.User} set name = ?, avatar = ?,address = ?,phone = ?,gender = ?,signature = ? where username = "${username}"`
    db.query(sql, [name, avatar, address, phone, gender, signature], (err, results) => {
      if (results.affectedRows === 1) {
        res.send({
          code: ResultCodeEnum.SUCCESS,
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
      code: ResultCodeEnum.SUCCESS,
      msg: "获取用户列表成功",
      data: results,
    })
  })
}



/**
 *  后台管理系统的接口
 */
exports.back_login = (req, res) => {
  // console.log(req.body)
  const sql = `select * from ${TABLE.User} where username = "${req.body.username}"`
  db.query(sql, (err, results) => {
    // console.log(err, results)
    res.send({
      code: ResultCodeEnum.SUCCESS,
      msg: "后台用户登录成功",
      data: {
        userInfo: results[0],
        access_token: results[0].role
      }
    })
  })

}

exports.back_logout = (req, res) => {
  // console.log(req.body)
  res.send({
    code: ResultCodeEnum.SUCCESS,
    logout: true
  })
}

exports.back_getUserList = (req, res) => {
  // console.log(req.body)
  const searchRole = req.body.role
  const keyword = "%" + req.body.name + "%"
  let sql = `select * from ${TABLE.User} `

  if (searchRole) {
    sql += `where role = "${searchRole}" `
  }
  if (req.body.name) {
    sql += `and name like ?`
  }

  db.query(sql, keyword, (err, results) => {
    // console.log(err, results)
    res.send({
      code: ResultCodeEnum.SUCCESS,
      msg: "获取用户列表成功",
      list: results,
      total: results.length,
      pageNum: 1,
      pageSize: 10
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
            code: ResultCodeEnum.SUCCESS,
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
      res.send({
        code: ResultCodeEnum.SUCCESS,
        data: results,
        msg: '修改用户名成功',
      })
    } else {
      res.send({
        code: 404,
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
        code: ResultCodeEnum.SUCCESS,
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
