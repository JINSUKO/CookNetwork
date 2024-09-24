/* 회원 기능 요청에 대한 유저 인증에 사용할 단기 승인 토큰을 생성합니다.*/

const jwt = require('jsonwebtoken');

require('dotenv').config({ path: '.env.local' });

/**
 * @param userId: 접근 승인 토큰 성성을 위한 해당 계정의 아이디 필요.
 * @returns { JWT Access Token }
 */
const generateAccessToken = (userId) => {
    // const ACCESS_TOKEN_EXPIRY = '15m'; // Access Token 만료시간 15분으로 설정함.
    const ACCESS_TOKEN_EXPIRY = '30m'; // Access Token 만료시간 30분으로 설정함.

    const SECRET_KEY = process.env.SECRET_KEY_ACCESS;
    console.log(SECRET_KEY);

    const payload = { userId };

    // 유저 아이디와, 비밀 키의 조합으로 토큰 생성.
    return jwt.sign(payload, SECRET_KEY, {expiresIn: ACCESS_TOKEN_EXPIRY});
}

module.exports = generateAccessToken;