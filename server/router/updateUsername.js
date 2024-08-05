const express = require('express');

const maria = require('../module/sql');

const router = express.Router();


router.post('/', async (req, res) => {

    const { username, user_code } = req.body;

    try {

        const query = 'UPDATE users SET username = ? WHERE user_code = ?;'

        const result = await maria.execute(query, [username, user_code]);

        return res.status(200).json({result});
    } catch (e) {
        return res.status(400).json({error: e});
    }

});


module.exports = router;