const express = require('express');

const emailConfig = require('../module/emailConfig');

const router = express.Router()

// 이메일 인증 번호 발송 라우터
router.post('/', async (req,res)=>{

    const { userEmail } = req.body;
    const authNum = '1234'; // 랜덤 값으로 변경해야함.

    try{
        const transporter = new emailConfig(userEmail, authNum);

        console.log("이메일 인증 번호 발송 중!")
        
        await transporter.sendMail();

        console.log("이메일 인증 번호 발송!")

        return res.status(200).json({authNum})


    } catch(error){
        console.error(error);
    }
    
})

module.exports = router;