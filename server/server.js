const express = require('express');
const path = require('path');
const cors = require('cors');
const morgan = require('morgan');
const socketIO = require('socket.io');
const cookieParser = require('cookie-parser');

const chatLog = require('./module/openChat.js');
const authAccessToken = require('./module/authAccessToken.js');
const authRefreshToken = require('./module/authRefreshToken.js');
// const personalData = require('./module/personalAPI.js')

require('dotenv').config();
// require('dotenv').config({ path: '.env.local' })
const app = express();

// Morgan logging dev 모드 설정
app.use(morgan('dev'));

// Cookie Parser
app.use(cookieParser())

// CORS 설정
app.use(cors({
    origin: ['https://cooknetwork.shop', 'http://localhost:5000', 'http://192.168.0.103:5000', 'http://192.168.0.139:5000', 'http://192.168.0.14:5000', 'http://192.168.220.1:5000'],
    credentials: true
}));

// Body parser
app.use(express.json());

// 유저 관련 요청은 /user/*로 미들웨어 하나로 모아 놓을 예정.
// 유저 프로필 이미지 불러오는 요청시 사용
const uploadUserImg = require('./router/uploadUserImg');
app.use('/api/uploadUserImg', uploadUserImg);

// 유저가 등록한 카테고리 불러오는 요청시 사용
const userCategoryNames = require('./router/getUserCategoryNames');
app.use('/api/userCategoryNames', userCategoryNames);

// 유저 카테고리 변경 요청시 사용
const userCategoryUpdate = require('./router/updateUserCategories');
app.use('/api/updateUserCategories', userCategoryUpdate);

// 유저 닉네임 변경 요청시 사용
const userNameUpdate = require('./router/updateUsername');
app.use('/api/userNameUpdate', userNameUpdate);

// 유저 일반 정보 변경 요청시 사용
const userInfoUpdate = require('./router/updateUserInfo');
app.use('/api/userInfoUpdate', userInfoUpdate);

// 모든 카테고리 불러오는 요청시 사용
const allCategoryNamesRouter = require('./router/getAllCategoryName');
app.use('/api/allCategoryName', allCategoryNamesRouter);

// 유저가 등록한 모든 선호 카테고리의 레시피 데이터 요청시 사용.
const userCateoryRecipesRouter = require('./router/getUserCateoryRecipes');
app.use('/api/userCategoryRecipes', userCateoryRecipesRouter);

// 유저 정보를 불러오는 요청시 사용
const userInfoRouter = require('./router/getUserInfo');
app.use('/api/userInfo', authAccessToken, authRefreshToken, userInfoRouter);

// 관리자 페이지 관련 요청시 사용
const adminRouter = require('./router/adminRouter');
app.use('/api/admin', adminRouter);

// 여기에 다른 API 라우트들을 추가합니다...

// 회원가입 중복확인 라우트 연결
const checkRouter = require("./router/checkSignUp.js");
// 중복확인 엔드포인트 요청시 호출
app.use("/api/check", checkRouter)

// 이메일 인증 라우트 연결
const emailAuthRouter = require("./router/emailAuth.js");
// 회원가입 라우트 요청시 사용
app.use("/api/emailAuth", emailAuthRouter);

// 회원가입 라우트 연결
const signupRouter = require("./router/signUp.js");
// 회원가입 라우트 요청시 사용
app.use("/api/signup", signupRouter);

// 회원탈퇴 라우트 연결
const userDeleteRouter = require("./router/deleteUser.js");
// 회원탈퇴 라우트 요청시 사용
app.use("/api/userDelete", userDeleteRouter);

// 로그인 라우트 연결
const loginRouter = require("./router/login.js");
// 로그인 라우트 요청시 사용
app.use("/api/login", loginRouter);

// 카테고리 라우트 연결
const categoryRouter = require("./router/searchCategory.js");
// 카테고리 라우트 요청시 사용
app.use("/api/category", categoryRouter)

// 검색 라우트 연결
const searchRouter = require("./router/searchDetails.js");
// 검색 라우트 요청시 사용
app.use("/api/search",searchRouter)

// 상세 페이지 라우트 연결
const detailpageRouter = require("./router/detailPage.js");
app.use("/api/recipe",detailpageRouter)

// 새로운 레시피 작성 라우트
const writeRecipesRouter = require("./router/writeRecipes.js");
app.use("/api/writeRecipe",writeRecipesRouter)

// 로그아웃 라우트 연결
const logoutRouter = require("./router/logout.js");
// 로그아웃 라우트 요청시 사용
app.use("/api/logout", logoutRouter);

// 로그인 승인 페이지 라우트 요청시 사용
app.get("/api/authPage", authAccessToken, authRefreshToken, (req, res) => {
    console.log('authPage', res.locals.accessExpired)
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

// 메인 서버
const PORT = process.env.PORT || 3000;
const server = app.listen(PORT, () => console.log(`Server running on port: ${PORT}`));


////////////////////////////////////////////////////////////////////////////////////////////////


// 노드 서버에서 동일한 포트로 소켓 서버를 열 수 있어 수정 08/27
// 채팅(socket) 서버
// const chat_PORT = 3001;
// const server= app.listen(chat_PORT, () => console.log(`Chat Server is running at ${chat_PORT}`))

// 소켓 서버 생성(모든 ip 접근 가능)
const io = new socketIO.Server(server, {
    cors: {
        origin: '*',
    }
});

// 1:1 채팅 관련 라우트
const personalRouter = require("./router/personalData.js");
app.use("/chat/personal",personalRouter)

// 접속 유저를 저장하기 위한 Map 생성
const userList = new Map();

// 클라이언트에서 메세지를 받음
const handleSocketMessage = (socket, data) => {
    console.log(data);

    // 접속된 모든 socket에 'Message'이름으로 전달
    socket.broadcast.emit('All_Message', data);
    //받은 메세지를 (유저코드, 유저닉네임, 채팅시간, 채팅내역)형태로 db에 저장하는 모듈
    chatLog.insertOpenChatLog(data)
};

const handleSocketUserEnter = async (socket, user) => {
    // 유저가 소켓에 연결을 성공했을 때 유저내역을 변수로 저장하고 기존 채팅내역을 보여주기 위한 코드
    // 유저 리스트에 없을 경우에만 실행(중복 실행 방지)
    if(!userList.has(socket.id)){
        // 유저리스트 Map에 socket.id: user정보 형태로 저장
        userList.set(socket.id, user);

        console.log('유저 접속: ',user.id);
        console.log('현재 접속 유저: ', [...userList.values()]);
        // 클라이언트 소켓에 'USER_ENTER'으로 'user' 전달
        io.emit('USER_ENTER', user);

        // db에 접속해 최근 10개의 채팅 데이터를 불러오는 모듈
        const chatlog = await chatLog.getOpenChatLog()
        console.log(chatlog)
        // 클라이언트 소켓에 'CHAT_LOG'으로 'chatlog' 전달
        socket.emit('CHAT_LOG', chatlog)
        // Promise로 실행하는 이유는
        // 비동기로 실행할 경우 db 접속 -> 데이터 획득 하는 속도보다
        // 클라이언트 소켓에 'CHAT_LOG'을 보내는 속도가 빨라
        // 'chatlog'가 제대로 클라이언트에 도달하지 않음
        // setTimeout도 사용가능
    }
}

const handleSocketUserLeave = (socket) => {
    // 유저 접속내역에서 클라이언트의 socket id를 키값으로 내용을 받아옴
    const userid = userList.get(socket.id);
    console.log('접속 해제: ',userid);

    if(userid){
        // 접속된 모든 socket에 'USER_LEAVE'이름으로 전달
        io.emit('USER_LEAVE',userid);
        // 유저리스트 Map에서 해당하는 유저 제거
        userList.delete(socket.id)
        console.log('현재 접속 유저: ', [...userList.values()]);
    }
};

const handleSocketEventRoom = (socket, username) =>{
    socket.join(username)
}

const handleSocketNewRoom = (socket, userData) =>{
    // const isUser =  personalData.newPersonalRoom(userData)
    socket.to(userData.toUser).emit('JOIN_NEW_ROOM',() => console.log('새로운 채팅방이 개설되었습니다.'))
}

const handleSocketConnection = async (socket) => {
    // 비동기로 실행
    // 클라이언이 소켓에서 'USER_ENTER'를 emit할때 실행
    socket.on('NEW_USER_ENTER', async (user) => handleSocketUserEnter(socket, user));

    // 클라이언트 소켓에서 "Message"를 emit할때 실행
    socket.on("Message_open",(data) => handleSocketMessage(socket, data));

    // 클라이언트 소켓이 서버를 떠날때 실행 ( socket 내장 함수 )
    socket.on('disconnect', () => handleSocketUserLeave(socket));

    socket.on('JOIN_EVENT_ROOM',(username) => handleSocketEventRoom(socket, username))

    socket.on('NEW_PERSONAL_ROOM',(userData) => handleSocketNewRoom(socket,userData))
    // 아직 모르지만 클라이언트에서 바로 python 서버로 요청을 보낼 거라서 없어도 될거 같음.
    // socket.on('Room_FAQ',(roomNumber) => {
    //     socket.join(roomNumber)
    //     console.log(roomNumber)
    // })
    // socket.on('Message_FAQ', (roomNumber, data) =>{
    //     console.log(roomNumber,':',data)
    //     // io.to(roomNumber).emit('Answer',data)
    // })
};
// 서버가 작동할시 실행 ( socket 내장 함수 )
io.on('connection',handleSocketConnection);

