const express = require('express');
const router = express.Router()

const maria = require('../module/sql') ;

router.get('/', async(req,res) =>{

    const noticeQuery = `SELECT * 
    FROM notices
    WHERE notice_id < 1000
    ORDER BY lastupdate_notice_date DESC
    `

    const [result] = await maria.execute(noticeQuery);

    return res.json(result)
})

module.exports = router;