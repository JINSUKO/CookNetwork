const express = require('express');

const maria = require('../module/sql');

const router = express.Router();



router.post('/', async (req, res) => {

    try {
        const query = `SELECT category_name
                        FROM 
                        ( SELECT *
                        FROM user_category uc
                        WHERE user_code = (SELECT user_code FROM users WHERE user_id = ?)) uc
                        JOIN categories c ON uc.category_id = c.category_id;`

        let [userCategories] = await maria.execute(query, [req.body.user_id]);

        // [{a:b}, {a,c}, ...] => { a: [ b, c, ...]} 로 변경하는 함수 코드.
        let userCategoriesList = (() => {
            if (userCategories != null) {
                return userCategories.reduce((acc, curr) => {
                    Object.keys(curr).forEach(key => {
                        if (!acc[key]) {
                            acc[key] = []
                        };
                        acc[key].push(curr[key]);
                    })
                    return acc;
                }, {})
            }

        })();

        // 조회 데이터가 없을 경우, { category_name:[] } 를 반환한다.
        if (Object.keys(userCategoriesList).length === 0) {userCategoriesList = { category_name: []}}

        return res.status(200).json(userCategoriesList.category_name)
    } catch (e) {
        return res.status(400).json({error: e});
    }

});


module.exports = router;