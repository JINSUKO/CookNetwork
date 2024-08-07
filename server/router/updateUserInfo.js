const express = require('express');

const maria = require('../module/sql');

const router = express.Router();


router.post('/', async (req, res) => {

    const { email, sex, user_id } = req.body;

    console.log(req.body);
    console.log(typeof sex)

    try {

        const query = 'UPDATE users SET email = ?, sex = ? WHERE user_id = ?;'

        const result = await maria.execute(query, [email, sex, user_id]);

        return res.status(200).json({result});
    } catch (e) {
        return res.status(400).json({error: e});
    }

});


module.exports = router;