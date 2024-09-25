const express = require('express');
const path = require('path')
const fs = require('fs')
const router = express.Router()

require('dotenv').config({ path: '.env.local' })


const maria = require('../module/sql');

const url = `https://res.cloudinary.com/${process.env.CLOUDINARY_NAME}/image/upload`

// get 요청을 받음
router.get('/',async (req,res)=>{
    // 검색결과를 쿼리 요청으로 받음
    const searchData = req.query;
    //console.log(searchData)
    // 검색 카테고리가 전체면 실행
    if(req.query.category === 'all'){
        // recipe_name에서 검색결과를 포함하는 recipe를 찾는 쿼리
        const queryString = `SELECT * FROM recipe 
            WHERE recipe_name LIKE ?`;
        try{
            const searchWord = '%' + searchData.q + '%'
            const [recipes] = await maria.execute(queryString,[searchWord]);
           // console.log(searchWord)

            //위에서 찾은 recipe와 recipe_img를 매칭시켜 json형태로 저장
            // const recipeImgPath = path.join(__dirname, '../', 'uploads', 'recipes', 'thumbnail/');
            const searchRecipes = recipes.map((recipe) => {
                // let recipePic = fs.readFileSync(path.join(recipeImgPath, recipe.recipe_img), 'base64');
                // recipePic = 'data:image/jpeg;base64,' + recipePic;
                return { ...recipe, recipe_img: `${url}/${recipe.recipe_img}` };
            });
            // 클라이언트로 response
            return res.json(searchRecipes);
        } catch(error){
            console.error(error);
        }
    }else{
        // 검색 카테고리가 전체가 아닐경우 실행
        // recipe의 카테고리가 검색 카테고리와 일치하는 내용 중 recipe_name에서 검색결과를 포함하는 recipe를 찾는 쿼리
        const queryString = `SELECT * FROM recipe r
            JOIN recipe_category rc 
            ON r.recipe_id = rc.recipe_id 
            JOIN categories c 
            ON rc.category_id = c.category_id 
            WHERE r.recipe_name LIKE ?
            AND c.category_name= ?`;
            try{
                const searchWord = '%' + searchData.q + '%'
                const [recipes] = await maria.execute(queryString,[searchWord,searchData.category]);
                //console.log(searchWord)

                //위에서 찾은 recipe와 recipe_img를 매칭시켜 json형태로 저장
                // const profileBasePath = path.join(__dirname, '../', 'uploads', 'recipes', 'thumbnail/');
                const searchRecipes = recipes.map((recipe) => {
                    // let recipePic = fs.readFileSync(path.join(profileBasePath, recipe.recipe_img), 'base64');
                    // recipePic = 'data:image/jpeg;base64,' + recipePic;
                    return { ...recipe, recipe_img: `${url}/${recipe.recipe_img}` };
                });
            // 클라이언트로 response
                return res.json(searchRecipes);
            } catch(error){
                console.error(error);
            }
    }
})

module.exports = router;