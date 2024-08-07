const express = require('express');
const router = express.Router()

const maria = require('../module/sql') ;


router.get('/:category',async(req,res)=>{
    const pageName = req.params.category;
    console.log(pageName)
    // const selectCategory = `SELECT *
    //                      FROM recipe
    //                      JOIN category ON recipe.category = category.category_id
    //                      WHERE category.category_name = '?'`;

    // TODO 기능 확인용 임시코드 카테고리 늘면 db에 접속해 불러오기
    const category = ['korean','japanese','chinese','western'];
    if(category.includes(pageName) || pageName == 'main'){
        if(pageName == 'main'){
            // TODO 일단 데이터 모두 전송 나중에 필요한 데이터만 보내도록 수정
            const queryString = `SELECT * FROM recipe ORDER BY RAND() LIMIT 10`;
            try{
                const [recipes] = await maria.execute(queryString);
                return res.json(recipes)
            } catch(error){
                console.error(error);
            }
        }
        else{
            res.json({ tag: pageName})
        }
    } else{
        res.json({ error: "존재하지 않는 카테고리입니다."})
    }
});

module.exports = router;