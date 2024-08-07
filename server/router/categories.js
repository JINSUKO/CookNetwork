const express = require('express');

const maria = require('../module/sql');

const router = express.Router();



router.post('/', async (req, res) => {

    console.log('fdsa', req.body);
    try {
        const query = `SELECT category_name FROM categories;`

        const [categoryList] = await maria.execute(query);

        return res.status(200).json(categoryList)
    } catch (e) {
        return res.status(400).json({error: e});
    }

});


module.exports = router;