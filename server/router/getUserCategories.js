const express = require('express');

const maria = require('../module/sql');

const router = express.Router();



router.post('/', async (req, res) => {

    console.log('fdsa', req.body);
    try {
        const query = `SELECT category_name
                        FROM 
                        ( SELECT *
                        FROM user_category uc
                        WHERE user_code = (SELECT user_code FROM users WHERE user_id = ?)) uc
                        JOIN categories c ON uc.category_id = c.category_id;`

        const [userCategoryList] = await maria.execute(query, [req.body.user_id]);

        // console.log(userCategoryList);

        return res.status(200).json(userCategoryList)
    } catch (e) {
        return res.status(400).json({error: e});
    }

});


module.exports = router;