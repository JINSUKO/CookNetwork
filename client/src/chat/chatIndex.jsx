import {useEffect, useRef, useState} from 'react';
import {io} from 'socket.io-client';

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
const socket = new io(socket_IP); // 도희님 학원 pc ip
// const socket = new io('http://192.168.0.14:3001/'); // 진수님 학원 wifi ip
//const socket = new io('http://192.168.0.13:3001/'); // 진수님 학원 wifi ip

function chatIndex({ userData }) {
  const { user_code, user_id, username } = userData || {}
  const [messageHistory, setMessageHistory] = useState([]);
  const [oldMessageLog, setOldMessageLog] = useState([]);

  const uid = useRef(null);
  const historyElement = useRef(null);

  const [userMessage, setUserMessage] = useState({
    id: user_code || '',
    name: username || '',
    message: '',
  });
  
  useEffect(() => {
    if(user_code && user_id && username){
      socket.emit('USER_ENTER',{ code: user_code, id: user_id, name: username});
      uid.current = user_code;
  }

    const onMessage = (data) =>{
      console.log(`${data.id}: `,data);
      setMessageHistory((prevHistory) => [...prevHistory, data]);
    };
    const onUserEnter = (user) =>{
      console.log(`${user.name}(${user.id}) 접속`);
    };
    const onUserLeave = (user) =>{
      console.log(`${user.name}(${user.id}) 접속 해제`);
    };
    const onChatLog = (data) =>{
      setOldMessageLog(data);
    }
    
    socket.on('Message', onMessage);
    socket.on('USER_ENTER', onUserEnter);
    socket.on('USER_LEAVE', onUserLeave);
    socket.on('CHAT_LOG',onChatLog);

    return () => {
      socket.off('Message', onMessage);
      socket.off('USER_ENTER', onUserEnter);
      socket.off('USER_LEAVE', onUserLeave);
      socket.off('CHAT_LOG', onChatLog);
    };
  }, [user_code, user_id, username]); 

  useEffect(() => {
    if(historyElement.current){
      historyElement.current.scrollTop = historyElement.current.scrollHeight;
    }
    console.log(messageHistory)
  }, [messageHistory,oldMessageLog]);

  const handleChange = (event) =>{
    setUserMessage((prevState) => ({
      ...prevState,
      [event.target.id]: event.target.value,
    }));
  };

  const handleSubmit = (e) =>{
    e.preventDefault();
    const messageToSend = { id: uid.current, name: userMessage.name, message: userMessage.message };
    socket.emit('Message', messageToSend);

    setMessageHistory((prevHistory) => [...prevHistory, messageToSend]);

    setUserMessage((prevUser) => ({
      ...prevUser,
      message: '',
    }));
  };
  
  return (
    <Container>
      <HistoryWrapper ref={historyElement}>
      {oldMessageLog.length === 0 && messageHistory.length === 0 ? (
          <NoHistory>Loading...</NoHistory>
        ) : (
          <>
          {oldMessageLog.map(({ user_code, user_name, chat_data }, index) => (
            <ChatItem key={index} me={user_code === userData.user_code}>
              <ChatName>{user_name}</ChatName>
              <ChatMessage>{chat_data}</ChatMessage>
            </ChatItem>
          ))}
          {messageHistory.map(({ id, name, message }, index) => (
            <ChatItem key={index} me={id === user_code}>
              <ChatName>{name}</ChatName>
              <ChatMessage>{message}</ChatMessage>
            </ChatItem>
          ))}
          </>
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

export default chatIndex;