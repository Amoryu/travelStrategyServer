const mysql = require('mysql')
const { DataBase } = require('../config.js')

const db = mysql.createPool({
  ...DataBase
})

module.exports = db;