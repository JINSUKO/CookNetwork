const express = require('express');
const jwt = require('jsonwebtoken');

const clearRefreshToken = require('../module/clearRefreshToken');
const maria = require('../module/sql') ;

const router = express.Router()

require('dotenv').config();

router.delete('/', (req, res)=>{
    const SECRET_KEY_ACCESS = process.env.SECRET_KEY_ACCESS;

    const authHeader = req.headers.authorization;


    if (!authHeader) {
        return res.status(202).json({ error: '이미 로그아웃 상태입니다.' });
    }

    if (authHeader.indexOf('Bearer ') !== 0) {
        return res.status(403).json({ error: '유효하지 않은 토큰입니다.' });
    }

    const accessToken = authHeader.substring(7);

    console.log('SECRET_KEY_ACCESS', SECRET_KEY_ACCESS);
    console.log('authHeader', authHeader);

    clearRefreshToken(res);

    jwt.verify(accessToken, SECRET_KEY_ACCESS, async (err, decoded) => {
        if (err) {
            if (err.name === 'TokenExpiredError') {
                return res.status(202).json({ error: '현재 토큰이 만료된 상태입니다.' })
            }

            return res.status(403).json({ error: '유효하지 않은 토큰입니다.' });
        }

        const query = `UPDATE users SET session_id = NULL, lastlogin_date = NULL WHERE user_id = ?;`;

        const result = await maria.execute(query, [decoded.userId]);

        return res.status(200).json({ message: '로그아웃이 정상적으로 처리되었습니다.' });

    });


});

module.exports = router;