const express = require('express');
const jwt = require('jsonwebtoken');

const {deleteToken, appendBlacklist} = require('../module/redis');
const clearToken = require('../module/clearToken');
const maria = require('../module/sql') ;

const router = express.Router()

require('dotenv').config();

router.delete('/', (req, res)=>{
    const SECRET_KEY_ACCESS = process.env.SECRET_KEY_REFRESH;

    // const authHeader = req.headers.authorization;

    const { accessToken,refreshToken } = req.cookies;


    // if (!authHeader) {
    //     return res.status(202).json({ error: '이미 로그아웃 상태입니다.' });
    // }

    // if (authHeader.indexOf('Bearer ') !== 0) {
    //     return res.status(403).json({ error: '유효하지 않은 토큰입니다.' });
    // }

    // console.log('SECRET_KEY_ACCESS', SECRET_KEY_ACCESS);
    // console.log('authHeader', authHeader);

    clearToken(res);

    jwt.verify(refreshToken, SECRET_KEY_ACCESS, async (err, decoded) => {
        if (err) {
            if (err.name === 'TokenExpiredError') {
                return res.status(202).json({ error: '현재 토큰이 만료된 상태입니다.' })
            }

            return res.status(403).json({ error: '유효하지 않은 토큰입니다.' });
        }

        let { userId, jti } = decoded;
        let tokenKey = `refreshtoken:${userId}:${jti}`
        // console.log(tokenKey)
        try{
            // redis에 있는 refreshtoken데이터를 삭제
            await deleteToken(tokenKey)
            // accessToken이 쿠키에 남아있으면 블랙리스트 등록
            if(accessToken){
                const listKey = `blacklist:${accessToken}`
                await appendBlacklist(listKey,userId)
            } 
        }catch(error){
            console.log(error)
        }

        // 마지막 로그인 일자를 기록하기 위해 lastlogin_date = NULL => current_timestamp()로 변경
        const query = `UPDATE users SET session_id = NULL, lastlogin_date = current_timestamp() WHERE user_id = ?;`;

        const result = await maria.execute(query, [decoded.userId]);

        return res.status(200).json({ message: '로그아웃이 정상적으로 처리되었습니다.' });

    });


});

module.exports = router;