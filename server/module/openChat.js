async function chatDataLog(data){
    // db 접속
    const maria = require('./sql');

    // user_open_chat 테이블에 user_code,user_name,chat_data 삽입하는 쿼리
    const queryString = `INSERT INTO user_open_chat(user_code, user_name, chat_data) VALUES(?, ?, ?)`
    // const queryString = `INSERT INTO user_open_chat(chat_data) VALUES(?)`

    await maria.execute(queryString,[data.id,data.name,data.message]);
}

async function getChatLog(){
    //db 접속
    const maria = require('./sql');

    // 최근 채팅내역 10개를 가져오는 쿼리
    const queryString = `SELECT user_code, user_name, chat_data
                        FROM (
                            SELECT *
                            FROM user_open_chat
                            ORDER BY chat_time DESC
                            LIMIT 10
                        ) AS recent_chats
                        ORDER BY chat_time ASC`

     let [chatlog] =  await maria.execute(queryString)

    return chatlog;
}

module.exports = { chatDataLog , getChatLog };