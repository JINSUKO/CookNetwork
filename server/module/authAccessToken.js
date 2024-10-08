const jwt = require('jsonwebtoken');

const clearToken = require('./clearToken');
const {checkToken} = require('./redis');

require('dotenv').config({ path: '.env.local' });

const authAccessToken = async (req, res, next) => {
    const SECRET_KEY_ACCESS = process.env.SECRET_KEY_ACCESS;

    // 클라이언트에서 헤더의 키가 Authorization 이지만, http 명세에 따르면 관례적으로,
    // 클라이언트에서 Authorization, 서버에서 authorization를 사용하며,
    // 대소문자 구분을 하지 않는다고 합니다.
    const { accessToken } = req.cookies;

    // 승인 토큰이 없다는 건 로그인한 이력이 없거나, 로그아웃을 했기 때문입니다.
    if (!accessToken) {
        // 이 경우에는 refresh token을 사용한 검증 과정을 수행해야합니다.
        res.locals.accessExpired = true;
        return next();
    }

    // 블랙리스트에 accessToken이 있으면 로그아웃 처리
    const listKey = `blacklist:${accessToken}`
    const isBlackList = await checkToken(listKey)
    if(isBlackList>0){
        clearToken(res);
        return res.status(403).json({ error: '유효하지 않은 access 토큰입니다.' });
    }

    // 유효하지 않은 authorization 헤더
    // if (authHeader.indexOf('Bearer ') !== 0) {
    //     clearRefreshToken(res);
    //     return res.status(403).json({ error: '유효하지 않은 access 토큰입니다.' });
    // }

    // const accessToken = authHeader.substring(7);


    jwt.verify(accessToken, SECRET_KEY_ACCESS, (err, decoded) => {
        if (err) {
            // access token 만료 외 다른 에러는 전부 유효하지 않은 토큰으로 인식하여
            // 사용자에게 재로그인을 유도합니다.
            console.log('err.name', err.name);
            clearToken(res);
            return res.status(403).json({ error: '유효하지 않은 access 토큰입니다.' });
        }

        // access token 이 유효한 경우에는 refresh token 검증 과정을 건너뛰고
        // 서비스 로직을 수행하게 합니다.
        res.locals.userId = decoded.userId;
        res.locals.accessExpired = false;

        console.log('res.locals.userId in authA',res.locals.userId)
        next();

        // 이 미들웨어에서는 토큰 검증까진만 수행하고 나머지 서비스 로직은 다음 미들웨어에서 수행합니다.
    });
}

module.exports = authAccessToken;