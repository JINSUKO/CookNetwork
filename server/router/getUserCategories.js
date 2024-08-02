const express = require('express');
const path = require('path');

const maria = require('../module/sql');

const router = express.Router();



router.post('/', async (req, res) => {

    console.log(req.body);
    try {
        const query = `SELECT category_name
                        FROM 
                        ( SELECT *
                        FROM user_category uc
                        WHERE user_code = ?) uc
                        JOIN categories c ON uc.category_id = c.category_id;`

        const [userCategoryList] = await maria.execute(query, [req.body.user_code]);

        // console.log(userCategoryList);

        return res.status(200).json(userCategoryList)
    } catch (e) {
        return res.status(400).json({error: e});
    }

});


module.exports = router;