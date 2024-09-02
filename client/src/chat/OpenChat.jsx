import {useCallback, useEffect, useRef, useState} from 'react';
import {io} from 'socket.io-client';
import {ListGroup, Nav, Offcanvas} from 'react-bootstrap';

//작성해둔 컴포넌트 불러옴
import {StyledApp} from './styled.jsx';

import ChatDesign from '../assets/styles/ChatMessage.module.css';


const{
    Container,
    Form,
    HistoryWrapper,
    RoomWrapper,
    NoHistory,
    ChatItem,
    ChatName,
    ChatMessage,
    IDInput,
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
    const personalChatRoom = useRef(null);
    const personalRoom = useRef(null)

    // 유저가 전송하는 메세지 저장
    // 처음 유저 데이터를 불러오는것에 실패해 undefind가 나오면 ''로 지정
    // [08/26 완] 메세지는 빈 값일경우 경고창이 뜨도록 나중에 수정할것
    // [08/30] FAQ 는 로그인 하지 않는 사용자도 이용할 수 있게 할 예정이므로 같이 적용될 수 있을 것 같음.
    const [userMessage, setUserMessage] = useState({
        id: user_id || '',
        name: username || '',
        message: '',
    });

    const [toId, setToId] = useState({
        name: ''
    })

    const [chatRoomArr, setChatRoomArr] = useState([]);

    // 채팅 창을 버튼 클릭으로 show, close 한다.
    const [chatShow, setChatShow] = useState(false);
    const [activeTab, setActiveTab] = useState('FAQ');
    const [isFormVisible, setIsFormVisible] = useState(true)

    // 채팅 컴포넌트 랜더링 될 때, Nav 탭 클릭 시 (activeTab 값 변경 시) 재랜더링 될 때 실행된다.
    useEffect(() => {
        async function fetchPersonalRoom() {
            try{
                const response = await fetch(`${socket_IP}/api/personal/room`,{
                    method: 'POST',
                    headers: {
                    'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({id: user_id})
                });

                const data = await response.json();
                setChatRoomArr(data)
            }catch(error){
                console.log(error);
            }
        }

        if(activeTab === 'FAQ'){
            // const joinFAQ = () =>{
            //     console.log(socket.id)
            //     socket.emit('Room_FAQ', socket.id)
            // }
            // socket.on('connect',joinFAQ)

        } else if(activeTab === 'openTalk'){
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
        } else if (activeTab === 'personalTalk'){
            console.log("1")
            fetchPersonalRoom();
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
        if(event.target.value.trim() === ''){
            if(event.target.id === 'message'){
                setUserMessage((prevState) =>({
                    ...prevState,
                 message: '',}));
            } else if(event.target.id === 'name'){
                setToId((prevState) =>({
                    ...prevState,
                 name: '',}));
            }
        }else{
            if(event.target.id === 'message'){
                setUserMessage((prevState) => ({
                    ...prevState,
                    [event.target.id]: event.target.value,
                }));
            } else if (event.target.id === 'name') {
                setToId((prevState)=>({
                    ...prevState,
                    [event.target.id]: event.target.value,
                }));
            }
        }
    };

    const fetchFAQAnswer = useCallback( async (FAQToSend) => {
        try {

            console.log('FAQToSend.message', FAQToSend.message)
            const AI_HOST_IP = import.meta.env.VITE_AI_HOST_IP;
            const response = await fetch(`${AI_HOST_IP}/ai/FAQAnswer`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({query: FAQToSend.message})
            });

            const { answer } = await response.json();

            const FAQAnswer = {...FAQToSend,id:'faq', name: 'FAQ', message: answer};

            console.log('FAQAnswer', FAQAnswer)

            setMessageFAQHistory((prevFAQHistory) => [...prevFAQHistory, FAQAnswer]);


        } catch (e) {
            console.error(e);
        }

    });

    const handleSubmit = (e) =>{
        // 입력 값이 없을경우 submit 못하도록 수정
        if(userMessage.message.trim() === '' && !(activeTab === 'personalTalk')){
            e.preventDefault()
            setUserMessage((prevUser)=> ({
                ...prevUser,
                message: '',}));
            return;
        } else if(toId.name.trim() === '' && activeTab === 'personalTalk'){
            e.preventDefault()
            setToId((prevName) =>({
                ...prevName,
                name: '',
            }));
            return;
        }
        
        // event별 submit 구분
        if(activeTab ==='FAQ'){
            e.preventDefault();
            const FAQToSend = {id: socket.id, name: userMessage.name, message: userMessage.message};
            // console.log(socket.id)

            console.log('FAQToSend', FAQToSend)

            setMessageFAQHistory((prevHistory) => [...prevHistory, FAQToSend]);
            setUserMessage((prevUser) => ({
                ...prevUser,
                message: '',
            }));


            // python 으로 실행한 http 서버로 요청을 보내서 답을 얻어 올 예정이므로,
            // express.js 로 요청을 보내지 않는다.
            // socket.emit('Message_FAQ',socket.id, FAQToSend);

            fetchFAQAnswer(FAQToSend);



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
            //TODO 검색한 이름을 확인하여 동일한 이름이 없으면 채팅방 생성 있으면 경고창 띄우기
            e.preventDefault();
            console.log(chatRoomArr.find(key => key.username === toId.name));
            setToId((prevName) =>({
                ...prevName,
                name: '',
            }));
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
            personalRoom.current.style.display = 'none';

            setIsFormVisible(true);
        } else if (k === 'openTalk') {
            FAQChatRoom.current.style.display = 'none';
            openChatRoom.current.style.display = 'flex';
            personalRoom.current.style.display = 'none';
            openChatRoom.current.scrollTop = openChatRoom.current.scrollHeight;
            setIsFormVisible(true);

        } else if (k === 'personalTalk') {
            FAQChatRoom.current.style.display = 'none';
            openChatRoom.current.style.display = 'none';
            personalRoom.current.style.display = 'flex';
            setIsFormVisible(false);
            // TODO 채팅리스트 서버에 요청하는 fetch와 없을 경우 작성
        }

        setActiveTab(k)
    }

    const handleClick = (e) =>
        console.log(e.target.textContent)


    // TODO personalTalk 수정사항 : 채팅리스트 불러오기, 눌렀을때 채팅내역 불러오기 등등등
    return (
        <Container>
            <div className={ChatDesign.chatIcon}>
                <i className={"fa-sharp fa-solid fa-comment-dots fa-2xl"} onClick={handleChatShow}></i>
            </div>
            <Offcanvas show={chatShow} onHide={handleChatClose} placement='end' scroll='true'>
                <div className={ChatDesign.FAQChatRoom} ref={FAQChatRoom}>
                    {/*<HistoryWrapper ref={historyElement}>*/}
                    {/* FAQ */}
                    <HistoryWrapper>
                        {messageFAQHistory.length ? (
                            <>
                                {messageFAQHistory.map(({id, name, message}, index) => (
                                    // <ChatItem key={index} me={id === userData.user_id}>
                                    <ChatItem key={index} me={id === socket.id}>
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
                {/* 오픈 채팅 방 */}
                <div className={ChatDesign.openChatRoom} ref={openChatRoom}>
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
                {/* 1대1 톡 */}
                <div className={ChatDesign.personalChatRoom} ref={personalRoom}>
                    <RoomWrapper>
                        {chatRoomArr.length ? (
                            <ListGroup variant="flush">
                                {chatRoomArr.map(({user_id,username,chat_data}, index) =>(
                                    <ListGroup.Item key={index} className='chat-arr' onClick={handleClick}>
                                        <ChatName>{username}</ChatName>
                                        {/* <ChatMessage>{chat_data}</ChatMessage> */}
                                    </ListGroup.Item>
                                ))}
                            </ListGroup>
                        ) : (
                            <NoHistory> 채팅 내역이 없습니다.</NoHistory>
                        )
                    }
                    </RoomWrapper>
                </div>
                <div className={`${!isFormVisible? ChatDesign.ChatInput : ChatDesign.hidden}`}>
                    <Form onSubmit={handleSubmit}>
                        <IDInput
                            id="name"
                            value={toId.name}
                            onChange={handleChange}
                            placeholder="닉네임을 입력하세요"
                        />
                        <SubmitButton>보내기</SubmitButton>
                    </Form>
                </div>
                <div className={ChatDesign.personalChatRoom} ref={personalChatRoom}>
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
                        <MessageInput
                            id="message"
                            value={userMessage.message}
                            onChange={handleChange}
                            placeholder="메시지를 입력하세요..."
                        />
                        <SubmitButton>보내기</SubmitButton>
                    </Form>
                </div>
                {/* 톡 채널 탭 */}
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