const express = require('express');
const path = require('path');
const fs = require('fs');

const maria = require('../module/sql');

const router = express.Router();

const getUserInfo = async (req, res) => {

    const tokenUserId = res.locals.userId;
    const userId = req.params.userId;

        if (tokenUserId === userId ) {
            const queryString = `SELECT user_code, username, user_img, sex, email, chef_code FROM users WHERE user_id = ? `;
            const [userdata] = await maria.execute(queryString, [userId]);
            if(userdata.length > 0) {

                // query 를 보낼 때 select에서 민감하지 않는 정보의 컬럼만 가져와야한다.
                // 사용자 정보는 부분적으로 마스킹해서 정보를 가려놓고 민감하지 않은 정보만 클라이언트에 넘겨야함.
                // 지금은 그대로 넘김.
                const {user_code, username, user_img, sex, email, chef_code} = userdata[0];

                // 유저 프로필 이미지를 파일명에서 base64로 데이터 변경함.
                // 이미지가 base64 데이터로 변환되어야 프론트의 Image 컴포넌트로 이미지 현상이 가능함.
                const profileBasePath = path.join(__dirname, '../', 'uploads', 'users', 'profile_images/');

                let profilePic = fs.readFileSync(path.join(profileBasePath, user_img), 'base64');
                profilePic = 'data:image/jpeg;base64,' + profilePic;

                const user = {
                    user_id: userId,
                    username,
                    user_img: profilePic,
                    sex,
                    email,
                    chef_code,
                    admin: (user_code => user_code <= 10)(user_code)
                };

                return user;

            }
        } else {
            throw new Error("No such user");
        }
}

router.post('/:userId', async (req, res) => {
    console.log('getUserInfo',res.locals.accessExpired);

    if (res.locals.accessExpired) {

        let user = null;

        try {   // 브라우저에서 loginUser의 값의 변경 시 user가 없기 때문에 발생하는 에러를 예외처리해주었다. 웹에서 예외 발생시 로그인 시도하도록 유도하는 코드는 이미 있음.
            user = await getUserInfo(req, res);

        } catch (e) {
            console.error('Error:', e.message);
            return res.status(400).json({error: e});
        }

        // console.log(user);
        return res.status(200).json({ user, accessToken: res.locals.accessToken, message: '유저 정보 요청이 승인 되었습니다.' });
    } else {
        const user = await getUserInfo(req, res);
        return res.status(200).json({ user, message: '유저 정보 요청이 승인 되었습니다.' });
    }

});


module.exports = router;