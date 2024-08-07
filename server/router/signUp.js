const express = require('express');
const router = express.Router()

const maria = require('../module/sql') ;


// 회원가입 라우터
// 클라이언트부터 post요청을 받을시 실행
router.post('/', async(req,res)=>{
    // 클라이언트로부터 유저정보를 받음
    const { userId, password, nickname, userSex, userEmail } = req.body;
    // 클라이언트에서 받은 데이터를 기반으로 db에 INSERT 인젝션 공격 방지를 위해 값을 ?로 받음
    const queryString = `INSERT INTO users(user_id, user_password, username, sex, email) VALUES(?, ?, ?, ?, ?)`
    
    try{
        await maria.execute(queryString, [userId, password, nickname, userSex, userEmail]);
        console.log("회원가입 성공!")
    } catch(error){
        console.error(error);
    }
    
})
module.exports = router;