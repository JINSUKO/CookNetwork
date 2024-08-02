import { forwardRef, useEffect, useRef, useState } from 'react';
import { Socket, io } from 'socket.io-client';

import { StyledApp } from './styled.jsx';

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

const socket = new io('http://192.168.0.103:3001/'); // 관용님 학원 pc ip
// const socket = new io('http://192.168.0.139:3001/'); // 도희님 학원 pc ip

// const socket = new io('http://192.168.0.14:3001/'); // 진수님 학원 wifi ip

function chatIndex({userData}) {
  console.log(userData)
  const [messageHistory, setMessageHistory] = useState([]);

  const uid = useRef(null);
  const historyElement = useRef(null);

  const [userMessage, setUserMessage] = useState({
    name: '',
    message: '',
  });
  useEffect(() => {
    const onConnect = () =>{
      uid.current = socket.id;
    };
    const onMessage = (data) =>{
      console.log(`${data.id}: `,data);
      
      setMessageHistory((prevHistory) => [...prevHistory, { id: uid.current, ...data}]);
    };
    const onUserEnter = (userId) =>{
      console.log(`${userId} 접속`);
    };
    const onUserLeave = (userId) =>{
      console.log(`${userId} 접속 해제`);
    };

    socket.on('connect', onConnect);
    socket.on('Message', onMessage);
    socket.on('USER_ENTER', onUserEnter);
    socket.on('USER_LEAVE', onUserLeave);
  }, []);

  useEffect(() => {
    if(historyElement.current){
    historyElement.current.scrollTop = historyElement.current.scrollHeight;
    }
  }, [messageHistory]);

  const handleChange = (event) =>{
    setUserMessage((prevState) => ({
      ...prevState,
      [event.target.id]: event.target.value,
    }));
  };

  const handleSubmit = (e) =>{
    e.preventDefault();
    const messageToSend = { id: uid.current, ...userMessage };
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
        {messageHistory.length === 0 ? (
          <NoHistory>첫 메시지를 남겨보세요🥳</NoHistory>
        ) : (
          messageHistory.map(({ id, name, message }, index) => (
            <ChatItem key={index} me={id === socket.id}>
              <ChatName>{name}</ChatName>
              <ChatMessage>{message}</ChatMessage>
            </ChatItem>
          ))
        )}
      </HistoryWrapper>
      <Form onSubmit={handleSubmit}>
        <NameInput>{userMessage.name}</NameInput>
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