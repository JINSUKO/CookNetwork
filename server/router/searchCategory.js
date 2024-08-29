const express = require('express');
const path = require('path')
const fs = require('fs')
const router = express.Router()

const maria = require('../module/sql') ;

// get 요청을 동적 라우팅으로 받음
router.get('/:category',async(req,res)=>{
    // 클라이언트에서 동적라우팅으로 카테고리명을 받음
    const pageName = req.params.category;
    // if(req.query.filters){
    //     console.log(req.query.filters.split(','));
    // }
    // console.log(pageName)
    // const selectCategory = `SELECT category_name
    //                      FROM categories
    //                      WHERE category_id > 9`;

    // 대분류 카테고리 확인 (한식, 중식, 일식, 양식, main)
    const category = ['한식','중식','일식','양식'];
    if(category.includes(pageName) || pageName == 'main'){
        if(pageName == 'main'){ //카테고리가 전체인 경우 실행
            // TODO 일단 데이터 모두 전송 나중에 필요한 데이터만 보내도록 수정
            try{
                let queryString;
                // 소분류 카테고리가 있을경우
                if(req.query.filters){
                    // {filter: 소분류} 형태를 배열로 분리
                    const categories = (req.query.filters.split(','))
                    // 한개의 문장으로 만들어서 쿼리 실행
                    const categoryList = categories.map(category => `'${category}'`).join(',');
                    // HAVING (COUNT)를 사용하여 받은 카테고리와 일치하는 것만 찾음
                    const cateCount = categories.length;
                    queryString = `
                        SELECT r.*
                        FROM recipe r
                        JOIN recipe_category rc ON r.recipe_id = rc.recipe_id
                        JOIN categories c ON rc.category_id = c.category_id
                        WHERE c.category_name IN (${categoryList})
                        GROUP BY r.recipe_id
                        HAVING COUNT(DISTINCT c.category_name) = ${cateCount}
                        ORDER BY RAND()
                        LIMIT 10
                    `
                } else{
                    queryString = `SELECT * FROM recipe ORDER BY RAND() LIMIT 10`;
                }
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
            let categories = [];
            if(req.query.filters){
                categories = (req.query.filters.split(','));
                categories.push(pageName);
            } else{
                categories.push(pageName)
            }
            
            const placeHolder = categories.map(() =>'?').join(',');
            const cateCount = categories.length;
            // request에서 받은 카테고리와 동일한 카테고리를 가진 recipe를 찾는 쿼리
            const queryString = `
                SELECT r.*
                FROM recipe r
                JOIN recipe_category rc ON r.recipe_id = rc.recipe_id
                JOIN categories c ON rc.category_id = c.category_id
                WHERE c.category_name IN (${placeHolder})
                GROUP BY r.recipe_id
                HAVING COUNT(DISTINCT c.category_name) = ?
                ORDER BY RAND()
                LIMIT 10
            `;
            try{
                console.log(categories)
                const [recipes] = await maria.execute(queryString,[...categories,cateCount]);

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
        res.status(404).json({ error: "존재하지 않는 카테고리입니다."})
    }
});

module.exports = router;