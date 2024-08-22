const express = require('express');
const path = require('path')
const fs = require('fs')
const router = express.Router()

const maria = require('../module/sql') ;

// get 요청을 동적 라우팅으로 받음
router.get('/:category',async(req,res)=>{
    //
    const pageName = req.params.category;
    console.log(pageName)
    // const selectCategory = `SELECT *
    //                      FROM recipe
    //                      JOIN category ON recipe.category = category.category_id
    //                      WHERE category.category_name = ?`;

    // TODO 기능 확인용 임시코드 카테고리 늘면 db에 접속해 불러오기
    const category = ['한식','중식','일식','양식'];
    if(category.includes(pageName) || pageName == 'main'){
        if(pageName == 'main'){
            // TODO 일단 데이터 모두 전송 나중에 필요한 데이터만 보내도록 수정
            const queryString = `SELECT * FROM recipe ORDER BY RAND() LIMIT 10`;
            try{
                const [recipes] = await maria.execute(queryString);

                // ../uploads/recipes/thumbnail/ 경로 지정
                const recipeImgPath = path.join(__dirname, '../', 'uploads', 'recipes', 'thumbnail/');
                // 여러개의 Promise를 비동기로 실행
                const updatedRecipes = await Promise.all(recipes.map(async (recipe) => {
                    // ../uploads/recipes/thumbnail/에서 recipe_img에 해당하는 이미지를 불러옴
                    let recipePic = fs.readFileSync(path.join(recipeImgPath, recipe.recipe_img), 'base64');
                    recipePic = 'data:image/jpeg;base64,' + recipePic;

                    // json형태로 리턴
                    return { ...recipe, recipe_img: recipePic };
                }));
                // 위에서 받은 json을 리턴
                return res.json(updatedRecipes);
            } catch(error){
                console.error(error);
            }
        }
        else{
            // request에서 받은 카테고리와 동일한 카테고리를 가진 recipe를 찾는 쿼리
            const queryString = `SELECT * FROM recipe r 
            JOIN recipe_category rc 
            ON r.recipe_id = rc.recipe_id 
            JOIN categories c 
            ON rc.category_id = c.category_id
            WHERE c.category_name = ?
            ORDER BY RAND() LIMIT 10`;
            try{
                const [recipes] = await maria.execute(queryString,[pageName]);

                // recipe를 각각의 이미지와 매칭시켜 리턴하는 작업 (위와 동일)
                const profileBasePath = path.join(__dirname, '../', 'uploads', 'recipes', 'thumbnail/');
                const updatedRecipes = await Promise.all(recipes.map(async (recipe) => {
                    let profilePic = fs.readFileSync(path.join(profileBasePath, recipe.recipe_img), 'base64');
                    profilePic = 'data:image/jpeg;base64,' + profilePic;
                    return { ...recipe, recipe_img: profilePic };
                }));
            
                return res.json(updatedRecipes);
            } catch(error){
                console.error(error);
            }
        }
    } else{
        res.json({ error: "존재하지 않는 카테고리입니다."})
    }
});

module.exports = router;