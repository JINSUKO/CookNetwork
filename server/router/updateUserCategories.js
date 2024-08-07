const express = require('express');

const maria = require('../module/sql');

const router = express.Router();


router.delete('/', async (req, res) => {

    const { user_id } = req.body;

    try {

        const query = `DELETE FROM user_category WHERE user_code = ( SELECT user_code FROM users WHERE user_id = ? );`;


        const result = await maria.execute(query, [user_id]);

        return res.status(200).json({result});
    } catch (e) {
        return res.status(400).json({error: e});
    }

});


router.post('/', async (req, res) => {

    const { categories, user_id } = req.body;

    try {

        let query = `INSERT INTO user_category  VALUES
                     (( SELECT user_code FROM users WHERE user_id = '${user_id}' ), (SELECT category_id FROM categories WHERE category_name = ? ))`;

        for (let i = 0; i < categories.length - 1; i++) {
            query += `,(( SELECT user_code FROM users WHERE user_id = '${user_id}' ), (SELECT category_id FROM categories WHERE category_name = ? ))`;
        }

        query += ';';


        const result = await maria.execute(query, [...categories]);

        return res.status(200).json({result});
    } catch (e) {
        return res.status(400).json({error: e});
    }

});


module.exports = router;