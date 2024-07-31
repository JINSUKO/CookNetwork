const express = require('express');
const router = express.Router()

const maria = require('../module/sql') ;

router.post('/', async(req,res)=>{
    const { userId, password, nickname, userSex, useremail } = req.body;

    const queryString = `INSERT INTO users(user_id, user_password, username, sex, email) VALUES(?, ?, ?, ?, ?)`
    
    try{
        await maria.execute(queryString,[userId,password,nickname,userSex,useremail]);
        console.log("회원가입 성공!")
    } catch(error){
        console.error(error);
    }
    
})
module.exports = router;