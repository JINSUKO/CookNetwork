import {useEffect, useRef, useState} from 'react';
import {io} from 'socket.io-client';

//작성해둔 컴포넌트 불러옴
import {StyledApp} from './styled.jsx';


const{
    Container,
    Form,
    HistoryWrapper,
    NoHistory,
    ChatItem,
    ChatName,
    ChatMessage,
    NameInput,
    MessageInput,
    SubmitButton
} = StyledApp;

const socket_IP  = import.meta.env.VITE_SOCKET_IP
// const socket = new io('http://192.168.0.103:3001/'); // 관용님 학원 pc ip
// 클라이언트 소켓 서버와 연결
const socket = new io(socket_IP);
// const socket = new io('http://192.168.0.14:3001/'); // 진수님 학원 wifi ip

function openChat({ userData }) {
    // 유저 데이터를 받아와서 변수에 딕셔너리 형터로 저장
    const { user_code, user_id, username } = userData || {}
    // 새로운 채팅 내역
    const [messageHistory, setMessageHistory] = useState([]);
    // 최근 10개의 채팅내역
    const [oldMessageLog, setOldMessageLog] = useState([]);

    // 변동 사항을 적용하기 위한 Ref지정
    const historyElement = useRef(null);

    // 유저가 전송하는 메세지 저장
    // 처음 유저 데이터를 불러오는것에 실패해 undefind가 나오면 ''로 지정
    // TODO 메세지는 빈 값일경우 경고창이 뜨도록 나중에 수정할것
    const [userMessage, setUserMessage] = useState({
        id: user_id || '',
        name: username || '',
        message: '',
    });

    useEffect(() => {
        //[user_code, user_id, username] 변동시 (처음 접속시) 실행
        if(user_code && user_id && username){
            // 서버에 'USER_ENTER'이름으로 유저정보를 emit
            socket.emit('NEW_USER_ENTER',{ id: user_id, name: username});

        }

        // 서버에서 data를 받아 messageHistory에 저장
        const onAllMessage = (data) =>{
            console.log(`${data.id}: `,data);
            setMessageHistory((prevHistory) => [...prevHistory, data]);
        };
        // 서버에서 접속 유저 정보를 받아 출력
        const onUserEnter = (user) =>{
            console.log(`${user.name}(${user.id}) 접속`);
        };
        // 서버에서 종료 유저 정보를 받아 출력
        const onUserLeave = (user) =>{
            console.log(`${user.name}(${user.id}) 접속 해제`);
        };
        const onChatLog = (data) =>{
            setOldMessageLog(data);
        }
        // 서버에서 각각 emit 받을경우 실행
        socket.on('All_Message', onAllMessage);
        socket.on('USER_ENTER', onUserEnter);
        socket.on('USER_LEAVE', onUserLeave);
        socket.on('CHAT_LOG',onChatLog);

        return () => {
            // 메모리 누수 방지용으로 종료시 서버와 연결 끊음
            socket.off('All_Message', onAllMessage);
            socket.off('USER_ENTER', onUserEnter);
            socket.off('USER_LEAVE', onUserLeave);
            socket.off('CHAT_LOG', onChatLog);
        };
    }, [user_code, user_id, username]);


    useEffect(() => {
        // messageHistory,oldMessageLog에 변동값이 있을때 실행
        if(historyElement.current){
            //scrollTop과 scrollHeight를 일치시켜 채팅이 늘어도 가려지는 부분 없이 전부 나오도록 함
            historyElement.current.scrollTop = historyElement.current.scrollHeight;
        }
        console.log(messageHistory)
    }, [messageHistory,oldMessageLog]);

    const handleChange = (event) =>{
        // 메세지 입력창에서 실행
        // 메세지를 입력할때마다 입력하는 내용이 바로 적용되도록 실행
        setUserMessage((prevState) => ({
            ...prevState,
            [event.target.id]: event.target.value,
        }));
    };

    const handleSubmit = (e) =>{
        // 전송 방지
        // 없을경우 Submit버튼 누를때 페이지 새로고침함
        e.preventDefault();
        // 입력받은 메세지를 딕셔너리 형태로 저장
        const messageToSend = { id: user_id, name: userMessage.name, message: userMessage.message };
        // 서버에 'Message'이름으로 messageToSend를 emit
        socket.emit('Message', messageToSend);

        // messageHistory에 저장
        setMessageHistory((prevHistory) => [...prevHistory, messageToSend]);

        // 보낸후 userMessage의 message 내용을 초기화
        setUserMessage((prevUser) => ({
            ...prevUser,
            message: '',
        }));
    };

    return (
        <Container>
            <HistoryWrapper ref={historyElement}>
                { oldMessageLog.length ? (
                    <>
                        {/*oldMessageLog,  messageHistory 내용을 반복해서 출력*/}
                        {oldMessageLog.map(({ user_code, user_name, chat_data }, index) => (
                            <ChatItem key={index} me={user_code === userData.user_code}>
                                <ChatName>{user_name}</ChatName>
                                <ChatMessage>{chat_data}</ChatMessage>
                            </ChatItem>
                        ))}
                        {messageHistory.map(({ id, name, message }, index) => (
                            <ChatItem key={index} me={id === user_id}>
                                <ChatName>{name}</ChatName>
                                <ChatMessage>{message}</ChatMessage>
                            </ChatItem>
                        ))}
                    </>
                ) : (
                    <NoHistory>채팅 내역이 없습니다.</NoHistory>
                )}
            </HistoryWrapper>
            <Form onSubmit={handleSubmit}>
                {/* <NameInput>{userMessage.name}</NameInput> */}
                <MessageInput
                    id="message"
                    value={userMessage.message}
                    onChange={handleChange}
                    placeholder="메시지를 입력하세요..."
                />
                <SubmitButton>보내기</SubmitButton>
            </Form>
        </Container>
    );
}

export default openChat;