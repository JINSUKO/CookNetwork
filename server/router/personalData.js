const express = require('express');
const router = express.Router()

const maria = require('../module/sql') ;

router.post('/room', async (req,res) =>{
    let user_id = req.body.id;
    // 전달받은 user_id를 users의 user_id와 비교하여 일치할 경우
    // users 테이블에 조인하여 user_personal_room 테이블의 
    // user_code_1이 user_id의 user_code와 일치할경우 user_code_2에 해당하는 users 데이터를
    // 다를경우 user_code_1에 해당하는 users 데이터를 select
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

    try{
        const [result] = await maria.execute(queryString, [user_id, user_id, user_id, user_id, user_id]);
        return res.json(result)
    }catch(e){
        console.log(e);
    }
})

// TODO 소켓 새로운 방 관련 코드 작성중
router.post('/new_room', async (req,res)=>{
    let from_user_id = req.body.id;
    let to_user_name = req.body.id2;
    const queryCheck = `SELECT user_code FROM users WHERE username = ?`

    const [checkUser] = await maria.execute(queryCheck,[to_user_name])

    if(checkUser.length > 0){
        const queryString = `INSERT INTO user_personal_room (user_code_1, user_code_2)
    SELECT 
        (SELECT user_code FROM users WHERE user_id = ?) AS user_code_1,
        (SELECT user_code FROM users WHERE username = ?) AS user_code_2`;

        const [result] = await maria.execute(queryString,[from_user_id, to_user_name])
        return res.status(207).json({message: '성공'})
    }else{
        return res.status(404).json({message: '실패'})
    }
})


module.exports = router