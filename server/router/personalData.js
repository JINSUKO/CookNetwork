const express = require('express');
const router = express.Router()

const maria = require('../module/sql') ;

router.post('/room', async (req,res) =>{
    let user_id = req.body.id;
    const queryString = `SELECT upr.room_id,
    CASE
        WHEN u1.user_id = ? THEN u2.user_code
        ELSE u1.user_code
    END AS user_code,
    CASE
        WHEN u1.user_id = ? THEN u2.user_id
        ELSE u1.user_id
    END AS user_id,
    CASE
        WHEN u1.user_id = ? THEN u2.username
        ELSE u1.username
    END AS username
FROM 
    user_personal_room upr
JOIN 
    users u1 ON upr.user_code_1 = u1.user_code
JOIN 
    users u2 ON upr.user_code_2 = u2.user_code
WHERE 
    u1.user_id = ? OR u2.user_id = ?`

    const [result] = await maria.execute(queryString, [user_id, user_id, user_id, user_id, user_id]);
    return res.json(result)
})

module.exports = router