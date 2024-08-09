const express = require('express');

const maria = require('../module/sql');

const router = express.Router();



router.get('/', async (req, res) => {

    try {
        const query = `SELECT category_name FROM categories;`

        const [allCategories] = await maria.execute(query);

        // [{a:b}, {a,c}, ...] => { a: [ b, c, ...]} 로 변경하는 함수 코드.
        let allCategoriesList = (() => {
            if (allCategories != null) {
                return allCategories.reduce((acc, curr) => {
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

        return res.status(200).json(allCategoriesList.category_name)
    } catch (e) {
        return res.status(400).json({error: e});
    }

});


module.exports = router;