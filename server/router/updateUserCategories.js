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

/*
`쿼리 밑의 코드로 개선 예정`

`WITH user_data AS (
    SELECT user_code, user_id
    FROM users
    WHERE user_id = 'aaa'
),
category_data AS (
    SELECT category_id, category_name
    FROM categories
    WHERE category_name IN ('메인반찬', '국/탕')
),
DATA(user_id, category_name) AS (
    VALUES
        ('aaa', '메인반찬'),
        ('aaa', '국/탕')
)
INSERT INTO user_category (user_code, category_id)
SELECT ud.user_code, cd.category_id
FROM DATA
JOIN user_data ud ON ud.user_id = data.user_id
JOIN category_data cd ON cd.category_name = data.category_name;`*/

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
