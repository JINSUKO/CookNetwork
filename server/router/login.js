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

    const queryString = `SELECT * FROM users WHERE user_id = ? AND user_password = ?`;

    try{
        const [userdata] = await maria.execute(queryString, [userId, password]); // [id, pw] => [userId, password] 변경
        if(userdata.length > 0){

            // query 를 보낼 때 select에서 민감하지 않는 정보의 컬럼만 가져와야한다.
            // 사용자 정보는 부분적으로 마스킹해서 정보를 가려놓고 민감하지 않은 정보만 클라이언트에 넘겨야함.
            // 지금은 그대로 넘김.
            const { user_code, user_id, username, user_img, sex, email, chef_code } = userdata[0];

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


            // console.log(refreshToken.jti);

            // 유저 프로필 이미지를 파일명에서 base64로 데이터 변경함.
            // 이미지가 base64 데이터로 변환되어야 프론트의 Image 컴포넌트로 이미지 현상이 가능함.
            const profileBasePath = path.join(__dirname, '../', 'uploads', 'users', 'profile_images/');

            let profilePic = fs.readFileSync(path.join(profileBasePath, user_img), 'base64');
            profilePic = 'data:image/jpeg;base64,' + profilePic;


            // 새로 로그인 하면서 변경된 refresh token 생성 시각(lastlogin_date 컬럼의 값)을 얻어야하는데,
            // db에 select 조회를 한 번 더 하기보다는 서버에서 new Date()로 시간을 비슷하게 생성하여 사용하는게 나은 것 같음.
            const user = { user_code, user_id, username, user_img: profilePic, sex, email, chef_code, lastlogin_date: new Date() };

            // access token은 클라이언트 로컬 저장소에 저장합니다..
            return res.json({ // return 추가 : 요청에 응답하고 router 함수 종료.
                user,
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