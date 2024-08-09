const express = require('express');
const path = require('path')
const fs = require('fs')
const router = express.Router()

const maria = require('../module/sql') ;


router.get('/:category',async(req,res)=>{
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
        else{
            const queryString = `SELECT * FROM recipe r 
            JOIN recipe_category rc 
            ON r.recipe_id = rc.recipe_id 
            JOIN categories c 
            ON rc.category_id = c.category_id
            WHERE c.category_name = ?
            ORDER BY RAND() LIMIT 10`;
            try{
                const [recipes] = await maria.execute(queryString,[pageName]);
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