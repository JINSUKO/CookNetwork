const express = require('express');
const router = express.Router()

const maria = require('../module/sql') ;

router.post('/', async(req,res)=>{
    let userId = req.body.userId;
    let password = req.body.password;

    const queryString = `SELECT * FROM users WHERE user_id = ? AND user_password = ?`;

    try{
         const [userdata] = await maria.execute(queryString, [id, pw])
        
         if(userdata.length > 0){
            let user = userdata[0]
            res.json(user);
         } else{
            res.status(406).json({message: "Login Fail"});
         }
    } catch(error){
        console.log(error)
    }
})

module.exports = router;