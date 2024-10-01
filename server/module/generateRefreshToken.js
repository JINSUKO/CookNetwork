/* 만료된 단기 승인 토큰의 재생성 검증에 필요한 장기 토큰을 생성합니다.*/

const jwt = require("jsonwebtoken");
const { v4: uuidv4 } = require("uuid");

require("dotenv").config({ path: '.env.local' });

/**
 *
 * @param userId: 접근 승인 토큰의 재성성을 위한 토근을 생성하기 위한 해당 계정의 아이디 필요.
 * @returns {{token: JWT Refresh Token, jti: uuidv4}}
 */
const generateRefreshToken = (userCode,userId) => {
    const REFRESH_TOKEN_EXPIRY = 30 * 24 * 60 * 60;

    const SECRET_KEY = process.env.SECRET_KEY_REFRESH;

    // jti는 각 jwt를 고유하게 식별하기 위한 식별자.
    // jti를 사용해서 만료, 폐기된 토큰을 승인하지 않거나 토큰의 재사용을 방지하고 각 토큰을 유일하게 만드는 데 사용.
    const jti = uuidv4();

    const payload = {
        userCode,
        userId,
        jti,
        expiresIn: REFRESH_TOKEN_EXPIRY
    }
  
    // refresh token 유효를 확인하기 위해서 jti를 사용해야해서,
    // refresh token 생성에 사용한 jti도 같이 반환한다.
    return {
        refreshToken: jwt.sign( payload, SECRET_KEY, {expiresIn: REFRESH_TOKEN_EXPIRY} ),
        jti
    }
}

module.exports = generateRefreshToken;

