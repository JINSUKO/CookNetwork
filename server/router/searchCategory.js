const express = require('express');
const router = express.Router()

const maria = require('../module/sql') ;


router.get('/:category',async(req,res)=>{
    const pageName = req.params.category;
    // const selectCategory = `SELECT *
    //                      FROM recipe
    //                      JOIN category ON recipe.category = category.category_id
    //                      WHERE category.category_name = '?'`;

    const category = ['korean','japanese','chinese','western'];
    if(category.includes(pageName)){
        res.json({ tag: pageName})
    } else{
        res.json({ error: "존재하지 않는 카테고리입니다."})
    }
});

module.exports = router;