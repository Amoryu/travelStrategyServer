
module.exports = {
  jwtSecretKey: 'This is a SecretKey',
  expiresIn: '10h',

  // baseURL: 'http://127.0.0.1',
  PORT: 8098,

  // 本地数据库
  // DataBase: { 
  //   host: '127.0.0.1',
  //   user: 'root',
  //   password: 'liao201027',
  //   database: 'travel_strategy',
  // },


  // 云托管域名
  baseURL: 'https://express-nvgi-74253-5-1312822569.sh.run.tcloudbase.com',
  // 云托管数据库
  DataBase: {
    MYSQL_ADDRESS: '10.13.103.14',
    MYSQL_USERNAME: 'root',
    MYSQL_PASSWORD: 'E7NxuASQ',
    database: 'nodejs_demo',
  },



}