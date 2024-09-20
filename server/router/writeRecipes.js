const express = require('express');
const router = express.Router()

const maria = require('../module/sql') ;

//TODO 받아온 이미지파일 decoding 하는 작업 추가
router.post('/',async(req,res)=>{
    console.log(req.body);
    // 새로운 레시피 등록하는 쿼리 유저코드는 user_id를 users에서 찾아 insert
    const insertRecipe = `
    INSERT INTO recipe( user_code,recipe_name,recipe_img,recipe_desc,cooked_time,serving,level,tips)
    SELECT user_code, ?,?,?,?,?,?,?
    FROM users
    WHERE user_id = ?`
    const connection = await maria.getConnection();
    try{
        await connection.beginTransaction()

        await connection.commit();
    } catch(error){
        await connection.rollback();
        console.log(error)
    } finally{
        connection.release()
    }
})

module.exports = router;