const express = require('express');

const router = express.Router()

const maria = require('../module/sql') ;

router.post('/', async(req,res)=>{
    let userId = req.body.userId;

})

module.exports = router;