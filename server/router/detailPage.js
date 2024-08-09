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
            const profileBasePath = path.join(__dirname, '../', 'uploads', 'recipes', 'thumbnail/');

            const searchpage= await Promise.all(data.map(async (recipe) => {
                let profilePic = fs.readFileSync(path.join(profileBasePath, recipe.recipe_img), 'base64');
                profilePic = 'data:image/jpeg;base64,' + profilePic;
                return { ...recipe, recipe_img: profilePic };
            }));
        
            return res.json(searchpage);
        } catch(error){
            console.error(error);
        }
    }else{
        res.status(404).json({ error: "해당하는 recipe_id가 없습니다"});
    }
})

module.exports = router;