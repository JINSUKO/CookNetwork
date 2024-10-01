const express = require('express');
const multer = require('multer');
const iconv = require('iconv-lite');
const cloudinary = require('../module/cloudinaryConfig');
const router = express.Router()

const maria = require('../module/sql') ;

const storage = multer.memoryStorage(); // 메모리에 저장
const upload = multer({ storage });

router.post('/',upload.fields([{ name: 'recipe_img',maxCount: 1},{ name: 'step_img'}]),async(req,res)=>{
    const recipeData = JSON.parse(req.body.recipeData);
    const file = req.files['step_img'];
    console.log(recipeData)
    console.log('files: ', file)

    // recipe_img 파일명 한글 인코딩
    const recipe_img = {
        ...imgFile,
        originalname: iconv.decode(Buffer.from(req.files['recipe_img'][0].originalname, 'latin1'), 'utf8')
    };
    // 새로운 레시피 등록하는 쿼리 유저코드는 user_id를 users에서 찾아 insert
    const insertRecipe = `
    INSERT INTO recipe( user_code,recipe_name,recipe_img,recipe_desc,cooked_time,serving,level,tips)
    SELECT user_code, ?,?,?,?,?,?,?
    FROM users
    WHERE user_id = ?`


    // 콜백지옥을 해결해보자...
    // TODO file 업로드할 파일로 변경할것
    const uploadRecipeImg = cloudinary.uploader.upload(file, {
        resource_type: 'image',
        format: 'webp',
        folder: '경로작성'
    }).then(response =>{
        return response.public_id
    }).then(public_id => {
        // TODO db에 데이터를 넣고 해당하는 recipe_id를 얻는 코드
        // const [result] = maria.execute(insertRecipe,[recipe_name,recipe_img,recipe_desc,cooked_time,serving,level,tips])
        return result.recipe_id
    }).then((recipe_id)=>{
        // TODO 과정 사진을 업로드하고 
    }).catch(error=>{
        console.error(error)
        throw error;
    })





    // const [result] = await maria.execute(insertRecipe,[recipe_name,recipe_img,recipe_desc,cooked_time,serving,level,tips])
    // const connection = await maria.getConnection();
    // try{
    //     await connection.beginTransaction()

    //     await connection.commit();
    // } catch(error){
    //     await connection.rollback();
    //     console.log(error)
    // } finally{
    //     connection.release()
    // }
    return res.json({response: 'ok1'})
})

module.exports = router;