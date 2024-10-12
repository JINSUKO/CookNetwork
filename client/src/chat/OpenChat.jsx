import {useCallback, useEffect, useRef, useState} from 'react';
import {io} from 'socket.io-client';
import {Alert, Image, ListGroup, Nav, Offcanvas} from 'react-bootstrap';
//작성해둔 컴포넌트 불러옴
import {StyledApp} from './styled.jsx';

import ChatDesign from '../assets/styles/ChatMessage.module.css';
import ConfirmModal from "../components/ConfirmModal.jsx";

import authFetch from '../fetchInterceptorAuthToken';
import authManager from "../authManager";


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
// 클라이언트 소켓 서버와 연결
const socket = new io(socket_IP);

const AI_HOST_IP = import.meta.env.VITE_AI_HOST_IP;

const loginUser = localStorage.getItem('loginUser')|| null;

function openChat({ userData }) {
    // 유저 데이터를 받아와서 변수에 지정
    const { user_id, username } = userData || {}
    // 새로운 채팅 내역
    const [messageHistory, setMessageHistory] = useState([]);
    // 최근 10개의 채팅내역
    const [oldMessageLog, setOldMessageLog] = useState([]);
    // FAQ 채팅 내역
    const [messageFAQHistory, setMessageFAQHistory] = useState([]);
    // Recipe 채팅 내역
    const [messageRecipeHistory, setMessageRecipeHistory] = useState([]);


    // 클라이언트를 구별할 ID 저장. <- 회원만 채팅 기능 가능하면 user_id로 구분 중이라서 필요가 없을듯?
    // FAQ 기능 추가 시 유저만 쓰게 하는게 맞나 싶긴하네요.
    // TODO 로그인 시에만 1:1 오픈채팅 입력 가능하게 하기 / FAQ는 누구나 이용가능
    // const uid = useRef(null);

    // 변동 사항을 적용하기 위한 Ref지정
    // const historyElement = useRef(null);
    const openChatRoom = useRef(null);
    const FAQChatRoom = useRef(null);
    const RecipeChatRoom = useRef(null);
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
        room: 0,
    });
    // 유저가 전송하는 닉네임 저장
    const [toId, setToId] = useState({
        name: ''
    })

    // 1:1 채팅탭에 들어갔을때 서버에서 방번호를 불러와 저장
    const [chatRoomArr, setChatRoomArr] = useState([]);

    // 채팅 창을 버튼 클릭으로 show, close 한다.
    const [chatShow, setChatShow] = useState(false);

    // 처음 들어갔을때 기본을 'FAQ'탭으로 지정
    const [activeTab, setActiveTab] = useState('FAQ');

    // 입력창을 상황에 따라 보이거나 사라지도록 설정
    const [isFormVisible, setIsFormVisible] = useState(true)

    const [isImgBtnVisible, setIsImgBtnVisible] = useState(false)

    const [isUpdate, setIsUpdate] = useState(false);

    const [searchImg, setSearchImg] = useState(null);
    const [searchImgBase64, setSearchImgBase64] = useState(null);
    const fileInputRef = useRef(null);
    const [showImgConfirmModal, setShowImgConfirmModal] = useState(false)

    // A가 새로운 방을 만들었을때 B가 요청없이 데이터를 받을수 있나?????
    // B가 채팅요청을 어떻게 받을지 고민?
    // 보이지않는 채팅방을 하나 만들어서 거기로 보내면???
    // 안읽은것도 확인해야하는가????

    // 서버에 요청하여 접속중인 유저id를 기준으로 1:1 채팅방을 불러오는 함수
    async function fetchPersonalRoom(){
        try{
            const response =  await fetch(`${socket_IP}/chat/personal/room`,{
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

    useEffect(()=>{
        if(user_id||!(user_id ==='')){
            socket.emit('JOIN_EVENT_ROOM',username)
        }
    },[user_id,socket])

    useEffect(() => {
        socket.on('JOIN_NEW_ROOM',()=>setIsUpdate(true))
        //'FAQ'탭일 경우
        if(activeTab === 'FAQ'){
            const joinFAQ = () =>{
                console.log(socket.id)
                // 서버의 'Room_FAQ'이벤트를 실행하고 socket.id 전달
                socket.emit('Room_FAQ',socket.id)
            }
            //'connect' 이벤트 요청을 받을시 joinFAQ 실행
            socket.on('connect',joinFAQ)
        } else if(activeTab === 'openTalk'){ // 'openTalk'탭일 경우
            // TODO 로그인한 유저만 사용 가능하도록 수정할것
            if(!loginUser){
                handleToggleTabs('FAQ')
                return alert('로그인후 이용 가능합니다.')
            }else{
                try {
                    const auth = async () =>{
                        const data = await authManager.addRequest(() => authFetch(`${socket_IP}/api/authPage`, {
                            method: 'POST',
                            body: JSON.stringify({userId: loginUser}),
                            credentials: 'include'
                          }));
                        return data
                    }
                    
                    const response = auth();
                    console.log(response);
                    
                  } catch (e) {
                    console.error(e);
                  }
                }
            if(user_id && username){
                // 서버의 'USER_ENTER'이벤트를 실행하고 'id', 'name' 전달
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
            // 서버에서 각각 이벤트 요청받을 경우 함수 실행
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
            // TODO 1:1 채팅 관련
            // 작성완료 : 처음 접속시 서버에 채팅방 요청
            fetchPersonalRoom();
            socket.on()
            if(isUpdate){
                fetchPersonalRoom();
                setIsUpdate(false);
            }
        };
        // activeTab, user_id이 바뀌면 업데이트
    }, [activeTab,user_id,isUpdate]);

    useEffect(() => {
        //'openTalk'탭일 경우
        if(activeTab === 'openTalk'){
            // 서버에서 data를 받아 messageHistory에 저장
            const onAllMessage = (data) =>{
                console.log(`${data.id}: `,data);
                setMessageHistory((prevHistory) => [...prevHistory, data]);
            };
            
            // 'All_Message' 이벤트 요청 받을시 함수 실행 
            socket.on('All_Message', onAllMessage);
    
            return () => {
                socket.off('All_Message', onAllMessage);
            };
        }
        // messageHistory의 길이가 바뀔때마다 업데이트
    }, [messageHistory.length, oldMessageLog.length]);


    useEffect(() => {

        // messageHistory,oldMessageLog,messageFAQHistory에 변동값이 있을때 실행
        // 스크롤 위치와 스크롤 현재 높이를 일치시켜 새로운 채팅이 올라와도 스크롤을 계속 밑에 있도록 함
        if(activeTab === 'FAQ' && FAQChatRoom.current){
            FAQChatRoom.current.scrollTop = FAQChatRoom.current.scrollHeight;       
        } else if(activeTab === 'Recipe' && RecipeChatRoom.current) {
            RecipeChatRoom.current.scrollTop = RecipeChatRoom.current.scrollHeight;
        } else if(activeTab === 'openTalk' && openChatRoom.current) {
            openChatRoom.current.scrollTop = openChatRoom.current.scrollHeight;
        }
    }, [messageHistory, oldMessageLog, messageFAQHistory, messageRecipeHistory]);

    // useEffect(() =>{
    //     // 
    //     if(activeTab === 'FAQ' && FAQChatRoom.current){
    //         FAQChatRoom.current.scrollTop = FAQChatRoom.current.scrollHeight;
    //     }
    // }, [messageFAQHistory]);

    const handleChange = (event) =>{
        // 메세지 입력창에서 실행
        // 메세지를 입력할때마다 입력하는 내용이 바로 적용되도록 실행

        // 입력값이 띄어쓰기 밖에 없을경우 쓸수 없도록함
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
            const response = await fetch(`${AI_HOST_IP}/ai/FAQAnswer`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({query: FAQToSend.message})
            });

            const { answer } = await response.json();

            const FAQAnswer = {id:'faq', name: 'FAQ', message: answer};

            console.log('FAQAnswer', FAQAnswer)

            setMessageFAQHistory((prevFAQHistory) => [...prevFAQHistory, FAQAnswer]);


        } catch (e) {
            console.error(e);
        }

    });

    const fetchRecipeAnswer = useCallback( async (RecipeToSend) => {
        try {
            console.log('RecipeToSend.message', RecipeToSend.message)
            const response = await fetch(`${AI_HOST_IP}/ai/recipeImage/chat/talk`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({query: RecipeToSend.message})
            });

            const { answer } = await response.json();

            const RecipeAnswer = {id:'recipe', name: '레시피 정보', message: answer};

            console.log('RecipeAnswer', RecipeAnswer)

            setMessageRecipeHistory((prevRecipeHistory) => [...prevRecipeHistory, RecipeAnswer]);


        } catch (e) {
            console.error(e);
        }

    });

    const handleSubmit = (e) =>{
        // 입력 값이 없을경우 submit 못하도록함
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
            fetchFAQAnswer(FAQToSend);
        } else if(activeTab ==='Recipe'){
            e.preventDefault();
            const RecipeToSend = {id: socket.id, name: userMessage.name, message: userMessage.message};
            // console.log(socket.id)
            console.log('RecipeToSend', RecipeToSend)
            setMessageRecipeHistory((prevHistory) => [...prevHistory, RecipeToSend]);
            setUserMessage((prevUser) => ({
                ...prevUser,
                message: '',
            }));
            fetchRecipeAnswer(RecipeToSend);
        } else if (activeTab === 'openTalk'){
            // 전송 방지
            // 없을경우 Submit버튼 누를때 페이지 새로고침함
            e.preventDefault();
            // userMessage.user_id, userMessage.name, userMessage.message을 json형태로 저장
            const messageToSend = { id: userMessage.id, name: userMessage.name, message: userMessage.message };
            // 서버의 'Message_open' 이벤트를 실행하고 messageToSend전달
            socket.emit('Message_open', messageToSend);

            // messageHistory에 저장
            setMessageHistory((prevHistory) => [...prevHistory, messageToSend]);

            // submit 후 userMessage의 message 내용을 초기화
            setUserMessage((prevUser) => ({
                ...prevUser,
                message: '',
            }));
        } else if (activeTab === 'personalTalk'){
            // 받은 이벤트의 id가 name일 경우 실행
            if(e.target.querySelector('.ID-input').id === 'name'){
            // [09/06 완] 검색한 이름을 확인하여 동일한 이름이 없으면 채팅방 생성 있으면 경고창 띄우기
            e.preventDefault();
            console.log(toId.name);
            // 입력한 닉네임과 같은 방이 있을때 경고창
            if(chatRoomArr.find(key => key.username === toId.name)){
                alert('해당 채팅방이 이미 있습니다!')
            // 입력한 닉네임이 사용자 닉네임과 동일한지 확인
            } else if(toId.name === username){
                alert('자신과 채팅할수 없습니다!')
            // 없을 경우 새로운 채팅방 생성
            } else{
                fetch(`${socket_IP}/chat/personal/new_room`,{
                    method: 'POST',
                    headers: {
                    'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({id: user_id, id2: toId.name})
                })
                .then(response =>{
                    if(response.status === 201){
                        return response.json();
                    }else if(response.status === 404){
                        throw new Error('404: User not Found');
                    }
                }).then(data =>{
                    console.log('a:', data.username)
                    console.log(chatRoomArr)
                    setChatRoomArr((prevRoom)=>
                        [
                            ...prevRoom
                            ,data
                        ]
                    );
                    socket.emit('NEW_PERSONAL_ROOM',{ toUser: toId.name,
                                                      user_id: user_id
                                                    });
                    alert('채팅방이 생성되었습니다.');
                }).catch(error =>{
                    console.log(error)
                    alert('존재하지 않는 유저입니다.');
                })
                // try{
                //     socket.emit('NEW_PERSONAL_ROOM',{toUser: toId.name, fromUser:user_id})
                    
                // }catch(error){
                //     console(error)
                // }
            }
            setToId((prevName) =>({
                ...prevName,
                name: '',
            }));
        } else {
            setUserMessage((prevUser) => ({
                ...prevUser,
                message: '',
            }));
        }
            
        }
    };

    const handleImageInput = () => {fileInputRef.current.click();}

    const handleFileChange = (event) => {
        console.log(event.target.files[0]);

        const file = event.target.files[0];

        if (!file) return

        if (!file.type.startsWith('image/')) return alert('이미지 파일만 선택해주세요.');

        setSearchImg(file);
        const reader = new FileReader();
        reader.onload = (e) => {
            setSearchImgBase64(e.target.result);
        }
        reader.readAsDataURL(file);


        setShowImgConfirmModal(true)
    };

    const sendImgConfirm = async () => {
        setShowImgConfirmModal(false);
        // 파일 저장 formData 객체 생성
        const formData = new FormData();
        formData.append('file', searchImg);

        let RecipeToSend = {id: socket.id, name: userMessage.name, message: "이미지를 분석중입니다 ..."};
        setMessageRecipeHistory((prevHistory) => [...prevHistory, RecipeToSend]);

        fileInputRef.current.value = null;

        try {
            const response = await fetch(`${AI_HOST_IP}/ai/recipeImage/chat/image`, {
                method: 'POST',
                body: formData
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error);
            }

            const { answer, query } = await response.json();

            RecipeToSend = {id: socket.id, name: userMessage.name, message: query};

            setMessageRecipeHistory((prevRecipeHistory) => [...prevRecipeHistory, RecipeToSend]);

            const RecipeAnswer = {id:'Recipe', name: '레시피정보', message: answer};

            setMessageRecipeHistory((prevRecipeHistory) => [...prevRecipeHistory, RecipeAnswer]);
            console.log('RecipeAnswer', RecipeAnswer)

        } catch (e) {
            console.error(e);
        }
    };

    const sendImgCancel = () => {
        fileInputRef.current.value = null;
        setShowImgConfirmModal(false);
        setSearchImg(null);
        setSearchImgBase64(null);
    }

    const handleChatShow = (e) => {
        setChatShow(true)
    };
    const handleChatToggle = () => setChatShow(!chatShow);
    const handleChatClose = () => setChatShow(false);

    // 각각의 탭을 눌렀을때 설정
    const handleToggleTabs = (k) => {
        if(k === 'FAQ') {
            FAQChatRoom.current.style.display = 'flex';
            RecipeChatRoom.current.style.display = 'none';
            openChatRoom.current.style.display = 'none';
            personalRoom.current.style.display = 'none';
            FAQChatRoom.current.scrollTop = FAQChatRoom.current.scrollHeight;

            setIsFormVisible(true);
            setIsImgBtnVisible(false);
        } else if(k === 'Recipe'){
            FAQChatRoom.current.style.display = 'none';
            RecipeChatRoom.current.style.display = 'flex';
            openChatRoom.current.style.display = 'none';
            personalRoom.current.style.display = 'none';
            RecipeChatRoom.current.scrollTop = RecipeChatRoom.current.scrollHeight;

            setIsFormVisible(true);
            setIsImgBtnVisible(true);
        } else if (k === 'openTalk') {
            FAQChatRoom.current.style.display = 'none';
            RecipeChatRoom.current.style.display = 'none';
            openChatRoom.current.style.display = 'flex';
            personalRoom.current.style.display = 'none';
            openChatRoom.current.scrollTop = openChatRoom.current.scrollHeight;

            setIsFormVisible(true);
            setIsImgBtnVisible(false);
        } else if (k === 'personalTalk') {
            FAQChatRoom.current.style.display = 'none';
            RecipeChatRoom.current.style.display = 'none';
            openChatRoom.current.style.display = 'none';
            personalRoom.current.style.display = 'flex';

            setIsFormVisible(false);
            setIsImgBtnVisible(false);
        }

        setActiveTab(k)
    }

    const handleClick = (e) =>{
        console.log(e.target.textContent)
        // 사용자명 눌렀을때 배열에서 해당 사용자의 방번호를 찾음
        console.log(chatRoomArr.find(key => key.username === e.target.textContent).room_id);
    }

    // TODO personalTalk 수정사항 : 채팅리스트 불러오기, 눌렀을때 채팅내역 불러오기 등등등
    return (
        <Container>
            <div className={ChatDesign.chatIcon}>
                <i className={"fa-sharp fa-solid fa-comment-dots fa-2xl"} onClick={handleChatToggle}></i>
                {/*<i className={"fa-sharp fa-solid fa-comment-dots fa-2xl"} onClick={handleChatShow}></i>*/}
            </div>
            <div className={`${ChatDesign.chatModal} ${chatShow ? ChatDesign.show : ''}`}  placement='end' scroll='true'>
            {/*<Offcanvas show={chatShow} onHide={handleChatClose} placement='end' scroll='true'>*/}

                {/* FAQ */}
                <div className={ChatDesign.FAQChatRoom} ref={FAQChatRoom}>
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
                {/* Recipe */}
                <div className={ChatDesign.RecipeChatRoom} ref={RecipeChatRoom}>
                    <HistoryWrapper>
                        {messageRecipeHistory.length ? (
                            <>
                                {messageRecipeHistory.map(({id, name, message}, index) => (
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
                {/* 1대1 채팅 */}
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
                    <Form className={`${ChatDesign.form}`} onSubmit={handleSubmit}>
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
                    <Form className={`${ChatDesign.form}`} onSubmit={handleSubmit} >
                        <MessageInput
                            id="message"
                            value={userMessage.message}
                            onChange={handleChange}
                            placeholder="메시지를 입력하세요..."
                        />
                        <SubmitButton>보내기</SubmitButton>
                        <div className={`${ChatDesign.imageUpload} ${isImgBtnVisible ? ChatDesign.ImgInput : ChatDesign.hidden}`}>
                            <label htmlFor="file-input" className={`${ChatDesign.imageUploadBtn}`} onClick={handleImageInput}>사진 올리기</label>
                            <input
                                id = "file-input"
                                type='file'
                                accept="image/*"
                                ref={fileInputRef}
                                onChange={handleFileChange}
                            />
                        </div>
                    </Form>
                    <ConfirmModal
                        show={showImgConfirmModal}
                        title="이미지 선택"
                        message={
                            <Image
                                src={searchImgBase64}
                                style={{ width: '100%' }}
                            />}
                        onConfirm={sendImgConfirm}
                        onCancel={sendImgCancel}
                    />
                </div>
                {/* 톡 채널 탭 */}
                <Nav activeKey={activeTab} onSelect={handleToggleTabs} className={ChatDesign.chatNav} >
                    <Nav.Item>
                        <Nav.Link eventKey='FAQ' className={ChatDesign.chatTab}>
                            FAQ
                        </Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                        <Nav.Link eventKey='Recipe' className={ChatDesign.chatTab}>
                            레시피 정보
                        </Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                        <Nav.Link eventKey='openTalk' className={ChatDesign.chatTab}>
                            오픈채팅방
                        </Nav.Link>
                    </Nav.Item>
                    {/*<Nav.Item>*/}
                    {/*    <Nav.Link eventKey='personalTalk' className={ChatDesign.chatTab}>*/}
                    {/*        1대1 톡방*/}
                    {/*    </Nav.Link>*/}
                    {/*</Nav.Item>*/}
                </Nav>
            </div>
            {/*</Offcanvas>*/}
        </Container>
    );
}

export default openChat;