const express = require('express');
const router = express.Router()

const maria = require('../module/sql') ;

router.post('/', async(req,res)=>{
    let id = req.body.userId;
    let pw = req.body.password;

    const queryString = `SELECT * FROM users WHERE user_id = ? AND user_password = ?`;

    try{
         const [user] = await maria.execute(queryString, [id, pw])
         
         if(user.length > 0){
            res.json({ login: '1'});
         } else{
            res.json({ login: '0'});
         }
    } catch(error){
        console.log(error)
    }
})

module.exports = router;