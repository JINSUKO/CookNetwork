const express = require('express');

const maria = require('../module/sql');

const router = express.Router();


router.post('/', async (req, res) => {

    console.log('fdsa', req.body);

    try {

        // const query =

        const result = await maria.execute(query);

        // console.log(result);

        return res.status(200).json({result});
    } catch (e) {
        return res.status(400).json({error: e});
    }

});


module.exports = router;