async function chatDataLog(data){
    const maria = require('./sql');
    const queryString = `INSERT INTO user_open_chat(user_code, user_name, chat_data) VALUES(?, ?, ?)`
    // const queryString = `INSERT INTO user_open_chat(chat_data) VALUES(?)`

    await maria.execute(queryString,[data.id,data.name,data.message]);
}

async function getChatLog(){
    const maria = require('./sql');
    const queryString = `SELECT user_code, user_name, chat_data
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

module.exports = { chatDataLog , getChatLog };