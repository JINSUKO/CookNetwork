const express = require('express');
const path = require('path');
const fs = require('fs');
const router = express.Router()

const maria = require('../module/sql');
const { error } = require('console');


router.get('/:recipe_id', async(req,res) =>{
    const id = req.params.recipe_id;
    const queryString = `SELECT r.*,u.user_code, u.username, u.user_img
    FROM recipe r
    JOIN users u 
    ON  r.user_code = u.user_code
    WHERE r.recipe_id = ?;`;

    const [data] = await maria.execute(queryString,[id])
    
    if(data.length > 0){
        try{
            const recipeImgPath = path.join(__dirname, '../', 'uploads', 'recipes', 'thumbnail/');
            const profileBasePath = path.join(__dirname, '../', 'uploads', 'users', 'profile_images/');
            const recipePage = async (data) => {
                let recipePic = fs.readFileSync(path.join(recipeImgPath, data.recipe_img), 'base64');
                recipePic = 'data:image/jpeg;base64,' + recipePic;
                let profilePic = fs.readFileSync(path.join(profileBasePath, data.user_img), 'base64');
                profilePic = 'data:image/jpeg;base64,' + profilePic;
                return { ...data, recipe_img: recipePic, user_img: profilePic};
            };
            const result = await recipePage(data[0]);
            return res.json(result);
        } catch(error){
            console.error(error);
        }
    }else{
        res.status(404).json({ error: "해당하는 recipe_id가 없습니다"});
    }
})

module.exports = router;