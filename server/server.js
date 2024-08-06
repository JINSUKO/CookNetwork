const express = require('express');
const path = require('path');
const cors = require('cors');
const morgan = require('morgan');
const socketIO = require('socket.io');
const cookieParser = require('cookie-parser');

const chatLog = require('./module/openChat.js');
const authAccessToken = require('./module/authAccessToken.js');
const authRefreshToken = require('./module/authRefreshToken.js');

require('dotenv').config();
// require('dotenv').config({ path: '.env.local' })
const app = express();

// Morgan logging dev 모드 설정
app.use(morgan('dev'));

// Cookie Parser
app.use(cookieParser())

// CORS 설정
app.use(cors({
    origin: ['http://localhost:5000', 'http://192.168.0.103:5000', 'http://192.168.0.139:5000', 'http://192.168.0.14:5000', 'http://192.168.220.1:5000'],
    credentials: true
}));

// Body parser
app.use(express.json());

// 유저 정보 불러오는 요청시 사용. 임시로 만들어 놓음.
const exGetUser = require('./exGetUser');
// API 라우트
// app.use('/hello', exGetUser, (req, res) => {
//     res.json({ message: 'Hello from server!', user: res.locals.user, profilePic: res.locals.profilePic});
// });
app.get('/hello', (req, res) => {
    res.json({ message: 'Hello from server!'});
});


// 유저 관련 요청은 /user/*로 미들웨어 하나로 모아 놓을 예정.
// 유저 프로필 이미지 불러오는 요청시 사용
const uploadUserImg = require('./router/uploadUserImg');
app.use('/api/uploadUserImg', uploadUserImg);

// 유저 프로필 이미지 불러오는 요청시 사용
const userCategories = require('./router/getUserCategories');
app.use('/api/userCategories', userCategories);

// 유저 닉네임 변경 요청시 사용
const userNameUpdate = require('./router/updateUsername');
app.use('/api/userNameUpdate', userNameUpdate);

// 유저 일반 정보 변경 요청시 사용
const userInfoUpdate = require('./router/updateUserInfo');
app.use('/api/userInfoUpdate', userInfoUpdate);

// 여기에 다른 API 라우트들을 추가합니다...

// 회원가입 라우트 연결
const signupRouter = require("./router/signUp.js");
// 회원가입 라우트 요청시 사용
app.use("/api/signup", signupRouter);

// 로그인 라우트 연결
const loginRouter = require("./router/login.js");
// 로그인 라우트 요청시 사용
app.use("/api/login", loginRouter);

// 카테고리 라우트 연결
const categoryRouter = require("./router/searchCategory.js");
// 카테고리 라우트 요청시 사용
app.use("/api/category", categoryRouter)

// 로그아웃 라우트 연결
const logoutRouter = require("./router/logout.js");
// 로그아웃 라우트 요청시 사용
app.use("/api/logout", logoutRouter);

// 로그인 승인 페이지 라우트 요청시 사용
app.get("/api/authPage", authAccessToken, authRefreshToken, (req, res) => {
    console.log(res.locals.accessExpired)
    if (res.locals.accessExpired) {
        return res.json({ accessToken: res.locals.accessToken, message: '회원 전용 페이지에 접근 승인 되었습니다.' });
    } else {
        return res.json({ message: '회원 전용 페이지에 접근 승인 되었습니다.' });
    }

});

// 정적 파일 서빙 (프로덕션 모드)
if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, '../client/dist')));
} else {
    console.log(path.join(__dirname, '../client'))
    app.use(express.static(path.join(__dirname, '../client')));
}

// 위에 해당하지 않는 모든
// API 404 에러 처리

// app.get('*', (req, res) => {
//     res.status(404).sendFile(path.join(__dirname, 'public', '404.html'));
// });

// React app의 라우팅을 위한 와일드카드 라우트
if (process.env.NODE_ENV === 'production') {
    app.get('*', (req, res) => {
        res.sendFile(path.join(__dirname, '../client/dist/index.html'));
    });
} else {
    app.get('*', (req, res) => {
        res.sendFile(path.join(__dirname, '../client/index.html'));
    });
}


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port: ${PORT}`));

const chat_PORT = 3001;
const server= app.listen(chat_PORT, () => console.log(`Chat Server is running at ${chat_PORT}`))

const io = new socketIO.Server(server, {
    cors: {
        origin: '*',
    },
});

const userList = new Map();

const handleSocketMessage = (socket, data) => {
    console.log(data);

    socket.broadcast.emit('Message', data);
    chatLog.chatDataLog(data)
};

const handleSocketDisconnect = (socket) => {
    const userid = userList.get(socket.id);
    console.log('접속 해제: ',userid);
    if(userid){
        socket.broadcast.emit('USER_LEAVE',userid);
        userList.delete(socket.id)
        console.log('현재 접속 유저: ', [...userList.values()]);
    }
};

const handleConnection = async (socket) => {
    socket.on('USER_ENTER', async (user) =>{
        if(!userList.has(user.id)){
        userList.set(socket.id, user);
        console.log('유저 접속: ',user.id);
        console.log('현재 접속 유저: ', [...userList.values()]);
        await socket.broadcast.emit('USER_ENTER', user);

        const chatlog = await chatLog.getChatLog()
        console.log(chatlog)
        await socket.broadcast.emit('CHAT_LOG', chatlog)
        }    
    });
        socket.on("Message",(data) => handleSocketMessage(socket, data));
        socket.on('disconnect', () => handleSocketDisconnect(socket));
    
};

io.on('connection',handleConnection);

