const express = require('express');
const path = require('path');
const fs = require('fs');

const maria = require('../module/sql');
const mappingImg = require('../module/fetchCloudinary');

const router = express.Router();



router.get('/', async (req, res) => {
    const { user_id } = req.query;
    console.log('user_id',user_id)

    try {
        const query = `SELECT *
                                FROM recipe
                                WHERE recipe_id in ( SELECT rc.recipe_id
                                FROM
                                (SELECT category_id
                                FROM user_category
                                WHERE user_code = ( SELECT user_code FROM users WHERE user_id = ? )) uc
                                JOIN recipe_category rc ON uc.category_id = rc.category_id );`

        let [userCategoryRecipes] = await maria.execute(query, [user_id]);
        console.log('userCategoryRecipes',userCategoryRecipes);

        // Cloudinary를 사용하는 주소 값으로 recipe_image 변경
        userCategoryRecipes = mappingImg(userCategoryRecipes);

        // const recipePicBasePath = path.join(__dirname, '../', 'uploads', 'recipes', 'thumbnail/');
        // userCategoryRecipes = userCategoryRecipes.map( recipe => {
        //     console.log('fdsfsda',fs.readFileSync(path.join(recipePicBasePath, recipe.recipe_img)))
        //     let recipeImgBase64 = fs.readFileSync(path.join(recipePicBasePath, recipe.recipe_img), 'base64');
        //     return {
        //         ...recipe,
        //         recipe_img: 'data:image/jpeg;base64,' + recipeImgBase64
        //     }
        // })


        console.log(userCategoryRecipes)

        return res.status(200).json(userCategoryRecipes)
    } catch (e) {
        return res.status(400).json({error: e});
    }

});


module.exports = router;