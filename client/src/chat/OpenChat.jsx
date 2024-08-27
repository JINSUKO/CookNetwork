import {useEffect, useRef, useState} from 'react';
import {io} from 'socket.io-client';
import {Nav, Offcanvas} from 'react-bootstrap';

//작성해둔 컴포넌트 불러옴
import {StyledApp} from './styled.jsx';

import ChatDesign from '../assets/styles/ChatMessage.module.css';


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

const socket_IP  = import.meta.env.VITE_HOST_IP
// const socket = new io('http://192.168.0.103:3001/'); // 관용님 학원 pc ip
// 클라이언트 소켓 서버와 연결
const socket = new io(socket_IP);
// const socket = new io('http://192.168.0.14:3001/'); // 진수님 학원 wifi ip

function openChat({ userData }) {
    // 유저 데이터를 받아와서 변수에 딕셔너리 형터로 저장
    const { user_id, username } = userData || {}
    // 새로운 채팅 내역
    const [messageHistory, setMessageHistory] = useState([]);
    // 최근 10개의 채팅내역
    const [oldMessageLog, setOldMessageLog] = useState([]);
    // FAQ 채팅 내역
    const [messageFAQHistory, setMessageFAQHistory] = useState([]);


    // 클라이언트를 구별할 ID 저장. <- 회원만 채팅 기능 가능하면 user_id로 구분 중이라서 필요가 없을듯?
    // FAQ 기능 추가 시 유저만 쓰게 하는게 맞나 싶긴하네요.
    // TODO 로그인 시에만 1:1 오픈채팅 입력 가능하게 하기 / FAQ는 누구나 이용가능
    // const uid = useRef(null);

    // 변동 사항을 적용하기 위한 Ref지정
    // const historyElement = useRef(null);
    const openChatRoom = useRef(null);
    const FAQChatRoom = useRef(null);

    // 유저가 전송하는 메세지 저장
    // 처음 유저 데이터를 불러오는것에 실패해 undefind가 나오면 ''로 지정
    // [08/26 완] 메세지는 빈 값일경우 경고창이 뜨도록 나중에 수정할것
    const [userMessage, setUserMessage] = useState({
        id: user_id || '',
        name: username || '',
        message: '',
    });

    // 채팅 창을 버튼 클릭으로 show, close 한다.
    const [chatShow, setChatShow] = useState(false);
    const [activeTab, setActiveTab] = useState('FAQ');
    const [isFormVisible, setIsFormVisible] = useState(true)

    useEffect(() => {
        if(activeTab === 'FAQ'){
            const joinFAQ = () =>{
                console.log(socket.id)
                socket.emit('Room_FAQ',socket.id)
            }
            socket.on('connect',joinFAQ)
        }
        if(activeTab === 'openTalk'){
            if(user_id && username){
                // 서버에 'USER_ENTER'이름으로 유저정보를 emit
                socket.emit('NEW_USER_ENTER',{ id: user_id, name: username});
                console.log('user_id',user_id)
                console.log('username',username)

            }

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

            socket.on('USER_ENTER', onUserEnter);
            socket.on('USER_LEAVE', onUserLeave);
            socket.on('CHAT_LOG',onChatLog);

            return () => {
                // 메모리 누수 방지용으로 종료시 서버와 연결 끊음
                socket.off('USER_ENTER', onUserEnter);
                socket.off('USER_LEAVE', onUserLeave);
                socket.off('CHAT_LOG', onChatLog);
            };
        };
    }, [activeTab]);

    useEffect(() => {
        if(activeTab === 'openTalk'){
            // 서버에서 data를 받아 messageHistory에 저장
            const onAllMessage = (data) =>{
                console.log(`${data.id}: `,data);
                setMessageHistory((prevHistory) => [...prevHistory, data]);
            };
    
            socket.on('All_Message', onAllMessage);
    
            return () => {
                socket.off('All_Message', onAllMessage);
            };
        }
    }, [messageHistory.length]);


    useEffect(() => {
        // messageHistory,oldMessageLog에 변동값이 있을때 실행
        if(activeTab === 'openTalk' && openChatRoom.current) {
            //scrollTop과 scrollHeight를 일치시켜 새로운 채팅이 올라와도 스크롤을 계속 밑에 위치시킴
            openChatRoom.current.scrollTop = openChatRoom.current.scrollHeight;
        }
    }, [messageHistory, oldMessageLog]);

    useEffect(() =>{
        if(activeTab === 'FAQ' && FAQChatRoom.current){
            FAQChatRoom.current.scrollTop = FAQChatRoom.current.scrollHeight;
        }
    }, [messageFAQHistory]);

    const handleChange = (event) =>{
        // 메세지 입력창에서 실행
        // 메세지를 입력할때마다 입력하는 내용이 바로 적용되도록 실행

        // 입력값이 띄어쓰기 밖에 없을경우 쓸수 없도록 수정
        if(event.target.value.trim() == ''){
            setUserMessage((prevState) =>({
                ...prevState,
             message: '',
            }))
        } else{
            setUserMessage((prevState) => ({
                ...prevState,
                [event.target.id]: event.target.value,
            }));
        }
        
    };

    const handleSubmit = (e) =>{
        // 입력 값이 없을경우 submit 못하도록 수정
        if(userMessage.message == ' ' || userMessage.message.trim() == ''){
            e.preventDefault()
            setUserMessage((prevUser)=> ({
                ...prevUser,
                message: '',}));
            return;
        }

        // event별 submit 구분
        if(activeTab ==='FAQ'){
            e.preventDefault();
            const FAQToSend = {id: user_id, name: userMessage.name, message: userMessage.message};
            console.log(socket.id)
            socket.emit('Message_FAQ',socket.id,FAQToSend);

            setMessageFAQHistory((prevHistory) => [...prevHistory, FAQToSend]);
            setUserMessage((prevUser) => ({
                ...prevUser,
                message: '',
            }));

        } else if (activeTab === 'openTalk'){
            // 전송 방지
            // 없을경우 Submit버튼 누를때 페이지 새로고침함
            e.preventDefault();
            // 입력받은 메세지를 딕셔너리 형태로 저장
            const messageToSend = { id: user_id, name: userMessage.name, message: userMessage.message };
            // 서버에 'Message'이름으로 messageToSend를 emit
            socket.emit('Message_open', messageToSend);

            // messageHistory에 저장
            setMessageHistory((prevHistory) => [...prevHistory, messageToSend]);

            // 보낸후 userMessage의 message 내용을 초기화
            setUserMessage((prevUser) => ({
                ...prevUser,
                message: '',
            }));
        } else if (activeTab === 'personalTalk'){

        }
        
    };



    const handleChatShow = (e) => {
        setChatShow(true)
    };
    const handleChatClose = () => setChatShow(false);

    const handleToggleTabs = (k) => {
        if(k === 'FAQ'){
            FAQChatRoom.current.style.display = 'flex';
            openChatRoom.current.style.display = 'none';
            setIsFormVisible(true);
        } else if (k === 'openTalk') {
            FAQChatRoom.current.style.display = 'none';
            openChatRoom.current.style.display = 'flex';
            openChatRoom.current.scrollTop = openChatRoom.current.scrollHeight;
            setIsFormVisible(true);

        } else if (k === 'personalTalk') {
            FAQChatRoom.current.style.display = 'none';
            openChatRoom.current.style.display = 'none';
            setIsFormVisible(false);
        }

        setActiveTab(k)
    }


    return (
        <Container>
            <div className={ChatDesign.chatIcon}>
                <i className={"fa-sharp fa-solid fa-comment-dots fa-2xl"} onClick={handleChatShow}></i>
            </div>
            <Offcanvas show={chatShow} onHide={handleChatClose} placement='end' scroll='true'>
                <div className={ChatDesign.FAQChatRoom} ref={FAQChatRoom}>
                    {/*<HistoryWrapper ref={historyElement}>*/}
                    <HistoryWrapper>
                        {messageFAQHistory.length ? (
                            <>
                                {messageFAQHistory.map(({id, name, message}, index) => (
                                    <ChatItem key={index} me={id === userData.user_id}>
                                        <ChatName>{name}</ChatName>
                                        <ChatMessage>{message}</ChatMessage>
                                    </ChatItem>
                                ))}
                            </>
                        ) : (
                            
                            <NoHistory>채팅 내역이 없습니다.</NoHistory>
                        )}
                    </HistoryWrapper>
                </div>
                <div className={ChatDesign.openChatRoom} ref={openChatRoom}>
                    {/*<HistoryWrapper ref={historyElement}>*/}
                    <HistoryWrapper>
                        {oldMessageLog.length || messageHistory.length ? (
                            <>
                                {/*oldMessageLog,  messageHistory 내용을 반복해서 출력*/}
                                {oldMessageLog.map(({user_id, user_name, chat_data}, index) => (
                                    <ChatItem key={index} me={user_id === userData.user_id}>
                                        <ChatName>{user_name}</ChatName>
                                        <ChatMessage>{chat_data}</ChatMessage>
                                    </ChatItem>
                                ))}
                                {messageHistory.map(({id, name, message}, index) => (
                                    <ChatItem key={index} me={id === userData.user_id}>
                                        <ChatName>{name}</ChatName>
                                        <ChatMessage>{message}</ChatMessage>
                                    </ChatItem>
                                )) }
                            </>
                        ) : (
                            <NoHistory>채팅 내역이 없습니다.</NoHistory>
                        )}
                    </HistoryWrapper>
                </div>
                <div className={`${isFormVisible? ChatDesign.ChatInput : ChatDesign.hidden}`}>
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
                    </div>
                <Nav activeKey={activeTab} onSelect={handleToggleTabs} className={ChatDesign.chatNav} >
                    <Nav.Item>
                        <Nav.Link eventKey='FAQ' className={ChatDesign.chatTab}>
                            FAQ
                        </Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                        <Nav.Link eventKey='openTalk' className={ChatDesign.chatTab}>
                            오픈채팅방
                        </Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                        <Nav.Link eventKey='personalTalk' className={ChatDesign.chatTab}>
                            1대1 톡방
                        </Nav.Link>
                    </Nav.Item>
                </Nav>
            </Offcanvas>
        </Container>
    );
}

export default openChat;