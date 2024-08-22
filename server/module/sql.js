const mysql = require('mysql2')
require('dotenv').config({ path: '.env.local' })

// db에 접속 createPool : db에 벙렬접속(다중접속) 가능
const{SQL_HOST,SQL_PORT,SQL_USER,SQL_PW,SQL_DB} = process.env;
const conn = mysql.createPool({
    host : SQL_HOST,
    port : SQL_PORT,
    user : SQL_USER,
    password : SQL_PW,
    database : SQL_DB
});
// 추가 옵션 기본 값
// waitForConnections: true,
// connectionLimit: 10,
// maxIdle: 10, // max idle connections, the default value is the same as `connectionLimit`
// idleTimeout: 60000, // idle connections timeout, in milliseconds, the default value 60000
// queueLimit: 0 c


module.exports = conn.promise() ;