const jwt = require('jsonwebtoken');

const clearRefreshToken = require('./clearRefreshToken');
const generateAccessToken = require('./generateAccessToken');
const generateRefreshToken = require('./generateRefreshToken');
const maria = require('./sql');

require('dotenv').config({ path: '.env.local' });

const authRefreshToken = (req, res, next) => {
    const SECRET_KEY_REFRESH = process.env.SECRET_KEY_REFRESH;

    // 유효한 access token이 만료되지 않았다면, 서비스 로직으로 넘어갑니다.
    if (!res.locals.accessExpired) {  return  next(); }

    // 유효한 access token이 만료되었다면,
    // refresh token을 이용해서 access token 재생성을 시도합니다.



    let { refreshToken } = req.cookies;

    // refresh token을 담은 쿠키가 없을 때. ( 클라이언트에서 쿠키가 만료시간이 되어 사라진 경우.)
    if (!refreshToken) {
        clearRefreshToken(res);
        return res.status(401).json({ error: '인증이 필요합니다.' });
    }

    jwt.verify(refreshToken, SECRET_KEY_REFRESH, async (err, decoded) => {

        if (err) {
            clearRefreshToken(res);
            return res.status(403).json({ error: '유효하지 않은 refresh 토큰입니다.' });
        }

        let { userId, jti } = decoded;

        const query = `SELECT session_id FROM users WHERE user_id = ?;`

        const [users] = await maria.execute(query, [userId]);

        if (users.length === 0) {
            clearRefreshToken(res);
            return res.status(403).json({ error: '사용자 정보를 찾을 수 없습니다.' });
        }

        console.log('users[0].session_id', users[0].session_id)
        console.log('jti',jti)
        if (jti !== users[0].session_id) {
            clearRefreshToken(res);
            return res.status(403).json({ error: '유효하지 않은 refresh 토큰입니다.' });
        }

        // Token Rotation: 새로운 Access Token 과 Refresh Token 생성
        const newAccessToken = generateAccessToken(userId);
        const newRefreshTokenWithJti = generateRefreshToken(userId);
        refreshToken = newRefreshTokenWithJti.refreshToken;
        jti = newRefreshTokenWithJti.jti;

        // userInfo api 에서 user_id 검증이 필요해서 추가했음. 24-08-24
        res.locals.userId = userId;

        // 이전 Refresh Token 제거 및 새 Refresh Token 추가
        const updateJtiQuery = `UPDATE users SET session_id = ?, lastlogin_date = CURRENT_TIMESTAMP WHERE user_id = ?;`;
        const result = await maria.execute(updateJtiQuery, [jti, userId]);

        console.log('result', result);

        // 서비스 로직에서 access token 을 res.locals에서 꺼내서 서비스로직의 응답 데이터와 같이 보내주면 된다.
        // res.status(200).json({ accessToken: res.locals.accessToken, ...나머지 응답 데이터 })
        res.locals.accessToken = newAccessToken;

        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            sameSite: 'strict', // 빌드 할때 프록시를 사용하든, 크로스 도메인 에서 쿠키가 넘어가지않게 해야 한다.
            maxAge: 24 * 60 * 60 * 1000 * 30, // 30일 후 만료 - 시간이 안 맞아서 expires 속성 사용합니다.
            path: '/',
            // expires: new Date(Date.now() + 9 * 60 * 60 * 1000) // 60분 후 만료
        })

        next();
    });

}

module.exports = authRefreshToken;