function chatDataLog(data){
    const maria = require('./sql');
    const queryString = `INSERT INTO user_open_chat(user_code, chat_data) VALUES(?, ?)`
    // const queryString = `INSERT INTO user_open_chat(chat_data) VALUES(?)`

    maria.execute(queryString,[data.id,data.message]);
}

module.exports = { chatDataLog };