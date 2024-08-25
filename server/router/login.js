const express = require('express');
const path = require('path');
const fs = require('fs');

const generateAccessToken = require('../module/generateAccessToken');
const generateRefreshToken = require('../module/generateRefreshToken');

const router = express.Router()

const maria = require('../module/sql') ;

router.post('/', async(req,res)=>{
    let userId = req.body.userId;
    let password = req.body.password;

    const queryString = `SELECT user_id FROM users WHERE user_id = ? AND user_password = ?`;

    try{
        const [userdata] = await maria.execute(queryString, [userId, password]); // [id, pw] => [userId, password] 변경
        if(userdata.length > 0){

            // query 를 보낼 때 select에서 민감하지 않는 정보의 컬럼만 가져와야한다.
            // 사용자 정보는 부분적으로 마스킹해서 정보를 가려놓고 민감하지 않은 정보만 클라이언트에 넘겨야함.
            // 지금은 그대로 넘김.
            const { user_id } = userdata[0];

            const accessToken = generateAccessToken(user_id);
            const { refreshToken, jti } = generateRefreshToken(user_id);

            console.log('refreshToken at login', refreshToken)

            // refresh token은 클라이언트 쿠키에 저장합니다.
            res.cookie('refreshToken', refreshToken, {
                httpOnly: true,
                sameSite: 'strict', // 빌드 할때 프록시를 사용하든, 크로스 도메인 에서 쿠키가 넘어가지않게 해야 한다.
                maxAge: 10 * 60 * 60 * 1000, // 60분 후 만료 - 시간이 안 맞아서 expires 속성 사용합니다.
                // path: '/',
                // expires: new Date(Date.now() + 9 * 60 * 60 * 1000) // 60분 후 만료
            })

            // jti => session_id 컬럼 사용
            // refresh token 생성 시각 => lastlogin_date 컬럼 사용
            const updateJtiQuery = `UPDATE users SET session_id = ?, lastlogin_date = CURRENT_TIMESTAMP WHERE user_id = ?;`;
            const result = await maria.execute(updateJtiQuery, [jti, user_id]);


            // access token은 클라이언트 로컬 저장소에 저장합니다..
            return res.json({ // return 추가 : 요청에 응답하고 router 함수 종료.
                user_id,
                accessToken,
                message: '로그인 성공'
            });
        } else{
            return res.status(406).json({message: "Login Fail"}); // return 추가 : 요청에 응답하고 router 함수 종료.
        }
    } catch(error){
        console.log(error)
    }
})

module.exports = router;