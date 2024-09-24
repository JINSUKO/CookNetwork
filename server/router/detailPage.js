const express = require('express');
const path = require('path');
const fs = require('fs');
const router = express.Router()

const maria = require('../module/sql');

const url = `https://res.cloudinary.com/${process.env.CLOUDINARY_NAME}/image/upload`

// get 요청을 동적 라우팅으로 받음
router.get('/:recipe_id', async(req,res) =>{
    // 클라이언트로부터 요청받은 id를 저장
    const id = req.params.recipe_id;
    // 해당하는 recipe와 해당 recipe를 작성한 유저를 찾는 쿼리
    const queryString = `SELECT r.*,u.user_code, u.username, u.user_img
    FROM recipe r
    JOIN users u 
    ON  r.user_code = u.user_code
    WHERE r.recipe_id = ?;`;

    const [data] = await maria.execute(queryString,[id])
    
    // 해당하는 recipe가 있을경우 실행
    if(data.length > 0){
        try{
            // ../uploads/recipes/thumbnail/ 경로 지정
            // const recipeImgPath = path.join(__dirname, '../', 'uploads', 'recipes', 'thumbnail/');
            // ../uploads/users/profile_images/ 경로 지정
            const profileBasePath = path.join(__dirname, '../', 'uploads', 'users', 'profile_images/');
            const recipePage = (data) => {
                // ../uploads/recipes/thumbnail/경로에서 recipe_img에 해당하는 이미지를 불러옴
                // let recipePic = fs.readFileSync(path.join(recipeImgPath, data.recipe_img), 'base64');
                // recipePic = 'data:image/jpeg;base64,' + recipePic;

                let recipePic = `${url}/${data.recipe_img}`

                // TODO 유저는 아직 추가안함... 기본 이미지+ 없는 이미지 추가할것
                // ../uploads/users/profile_images/경로에서 user_img에 해당하는 이미지를 가져옴
                let profilePic = fs.readFileSync(path.join(profileBasePath, data.user_img), 'base64');
                profilePic = 'data:image/jpeg;base64,' + profilePic;

                // 찾은 데이터를 json형태로 리턴
                return { ...data, recipe_img: recipePic, user_img: profilePic};
            };
            const result = await recipePage(data[0]);

            // 클라이언트로 response
            return res.json(result);
        } catch(error){
            console.error(error);
        }
    }else{
        // 해당하는 recipe가 없을경우
        res.status(404).json({ error: "해당하는 recipe_id가 없습니다"});
    }
})

module.exports = router;