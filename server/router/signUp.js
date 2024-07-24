const express = require('express');
const router = express.Router()

const maria = require('../module/sql') ;

router.post('/', async(req,res)=>{
    let id = req.body.userId;
    let pw = req.body.password;
    let name = req.body.nickname;
    let sex = req.body.userSex;
    let email = req.body.userEmail;

    const queryString = `INSERT INTO users(user_id, user_password, username, sex, email) VALUES(?, ?, ?, ?, ?)`
    
    try{
        await maria.execute(queryString,[id,pw,name,sex,email]);
        console.log("회원가입 성공!")
    } catch(error){
        console.log(error);
    }
    

})
module.exports = router;