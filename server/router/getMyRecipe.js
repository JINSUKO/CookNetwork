const express = require('express');

const mappingImg = require('../module/fetchCloudinary');
const maria = require('../module/sql');

const router = express.Router();

const url = `https://res.cloudinary.com/${process.env.CLOUDINARY_NAME}/image/upload`


router.get('/:user_id', async(req,res)=>{
    const userId = req.params.user_id;

    const recipeQuery = `SELECT r.*
    FROM recipe r
    JOIN users u 
    ON r.user_code = u.user_code
    WHERE u.user_id = ?
    `

    try{
        const [recipes] = await maria.execute(recipeQuery,[userId])
        const updatedRecipes = mappingImg(recipes)
        if(recipes.length>0){
            return res.status(200).json(updatedRecipes);
        }else{
            return res.status(404).json({message: '작성한 레시피가 없습니다!'})
        }
    }catch(error){
        console.error(error)
        return res.status(400).json({message: 'error: 레시피를 불러올 수 없습니다.'})
    }

})

module.exports = router;