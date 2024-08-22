async function insertOpenChatLog(data){
    const maria = require('./sql');
    const queryString = `INSERT INTO user_open_chat ( user_code, user_id, user_name, chat_data )
                            VALUES ((SELECT user_code FROM users WHERE user_id = ?), ?, ?, ?);`


    await maria.execute(queryString,[data.id, data.id, data.name, data.message]);
}

async function getOpenChatLog(){
    const maria = require('./sql');
    const queryString = `SELECT user_id, user_name, chat_data
                        FROM (
                            SELECT *
                            FROM user_open_chat
                            ORDER BY chat_time DESC
                            LIMIT 10
                        ) AS subquery
                        ORDER BY chat_time ASC`

     let [chatlog] =  await maria.execute(queryString)

    return chatlog;
}

module.exports = { insertOpenChatLog, getOpenChatLog };