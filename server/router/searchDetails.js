const express = require('express');
const path = require('path')
const fs = require('fs')
const router = express.Router()

const maria = require('../module/sql');

router.get('/',async (req,res)=>{
    const searchData = req.query;
    console.log(searchData)
    if(req.query.category === 'main'){
        const queryString = `SELECT * FROM recipe 
            WHERE recipe_name LIKE ?`;
        try{
            const searchWord = '%' + searchData.q + '%'
            const [recipes] = await maria.execute(queryString,[searchWord]);
            console.log(searchWord)
            const recipeImgPath = path.join(__dirname, '../', 'uploads', 'recipes', 'thumbnail/');

            const searchRecipes = await Promise.all(recipes.map(async (recipe) => {
                let recipePic = fs.readFileSync(path.join(recipeImgPath, recipe.recipe_img), 'base64');
                recipePic = 'data:image/jpeg;base64,' + recipePic;
                return { ...recipe, recipe_img: recipePic };
            }));
        
            return res.json(searchRecipes);
        } catch(error){
            console.error(error);
        }
    }else{
        const queryString = `SELECT * FROM recipe r
            JOIN recipe_category rc 
            ON r.recipe_id = rc.recipe_id 
            JOIN categories c 
            ON rc.category_id = c.category_id 
            WHERE recipe_name LIKE ?`;
            try{
                const searchWord = '%' + searchData.q + '%'
                const [recipes] = await maria.execute(queryString,[searchWord]);
                console.log(searchWord)
                const profileBasePath = path.join(__dirname, '../', 'uploads', 'recipes', 'thumbnail/');
    
                const searchRecipes = await Promise.all(recipes.map(async (recipe) => {
                    let profilePic = fs.readFileSync(path.join(profileBasePath, recipe.recipe_img), 'base64');
                    profilePic = 'data:image/jpeg;base64,' + profilePic;
                    return { ...recipe, recipe_img: profilePic };
                }));
            
                return res.json(searchRecipes);
            } catch(error){
                console.error(error);
            }
    }
})

module.exports = router;