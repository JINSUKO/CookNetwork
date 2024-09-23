const maria = require('./sql');

async function newPersonalRoom(userData){
    const to_nickname = userData.toUser
    const from_id = userData.fromUser

    const queryCheck = `SELECT user_code FROM users WHERE username = ?`

    const [checkUser] = await maria.execute(queryCheck,[to_nickname])

    if(checkUser.length >0){
        const queryString = `INSERT INTO user_personal_room (user_code_1, user_code_2)
        SELECT 
            (SELECT user_code FROM users WHERE user_id = ?) AS user_code_1,
            (SELECT user_code FROM users WHERE username = ?) AS user_code_2`;

        const [result] = await maria.execute(queryString,[from_id, to_nickname]);
        return result
    }
    else{
        return false
    }
}

module.exports = { newPersonalRoom };