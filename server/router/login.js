const express = require('express');
const router = express.Router()

const maria = require('../module/sql') ;

router.post('/', async(req,res)=>{
    let id = req.body.userId;
    let pw = req.body.password;

    const queryString = `SELECT * FROM users WHERE user_id = ? AND user_password = ?`;

    try{
         const [user] = await maria.excute(queryString, [id, pw])
         
         if(user.length > 0){
            // 로그인 성공
         } else{
            // 로그인 실패
         }
    } catch(error){
        console.log(error)
    }
})