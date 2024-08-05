const express = require('express');
const path = require('path');
const fs = require('fs');

const router = express.Router();

const maria = require('./module/sql');

router.get('/', async (req, res, next) => {
    const querystirng = `SELECT *
                            FROM (
                            SELECT 
                                ROW_NUMBER() OVER (ORDER BY user_code ASC) AS row_num, users.*
                            FROM users 
                            ) AS users
                        WHERE users.row_num = 1;`

    try {
        const [users] = await maria.execute(querystirng);

        res.locals.user = users[0];

        const profileBasePath = path.join(__dirname, 'uploads', 'users', 'profile_images/');

        const profilePic = fs.readFileSync(path.join(profileBasePath, res.locals.user.user_img), 'base64');
        console.log(res.locals.user)
        res.locals.profilePic = 'data:image/jpeg;base64,' + profilePic;

    } catch (e) {
        console.error('Error: ', e);
    }

    next();

})

module.exports = router;