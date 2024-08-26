const express = require('express');
const router = express.Router()

const maria = require('../module/sql') ;

router.post('/idcheck',async(req,res)=>{
    let checkId = req.body.userId;

    const queryString = `SELECT user_id FROM users WHERE user_id = ?`;

    try{
        const [idCheck] = await maria.execute(queryString, [checkId])
        if(idCheck.length > 0){
            res.status(409).json({message: "이미 존재하는 id입니다"});
        }
        else{
            res.status(200).json({message: "생성 가능한 id입니다"});
        }
    } catch(error) {
        console.log(error)
    }
})

router.post('/emailcheck',async(req,res)=>{
    let checkEmail = req.body.userEmail;

    const queryString = `SELECT email FROM users WHERE email = ?`;

    try{
        const [emailCheck] = await maria.execute(queryString, [checkEmail])
        if(emailCheck.length > 0){
            res.status(409).json({message: "이미 존재하는 email입니다"});
        }
        else{
            res.status(200).json({message: "생성 가능한 email입니다"});
        }
    } catch(error) {
        console.log(error)
    }
})


module.exports = router;