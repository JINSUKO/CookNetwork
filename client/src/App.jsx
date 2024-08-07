import React, { useState, useEffect } from 'react'
import Main from './pages/Main'
import Board from './pages/Board';
import SignUp from './pages/SignUp'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Layout/Header'
import Footer from './components/Layout/Footer'
import Login from './pages/Login'
import RecipeDetail from './components/RecipeDetail'
import Chat from "./chat/chatIndex";
import UserMyPage from "./pages/UserMyPage";
import SearchResultPage from './components/SearchResult';
import RecipeList from './components/RecipeList';
import Logout from "./components/Logout";
import ProtectedPage from "./pages/authToken/ProtectedPage";

import './App.css'

function App() {
  let loginUser = localStorage.getItem('loginUser');

  const [message, setMessage] = useState('');
  const [user, setUser] = useState(loginUser && JSON.parse(loginUser));
  const [profilePic, setProfilePic] = useState(loginUser && JSON.parse(loginUser).user_img);

  const HOST_IP  = import.meta.env.VITE_HOST_IP
  const API_URL = HOST_IP;
  
  useEffect(() => {
    // const API_URL = import.meta.env.PROD
    //   ? ''
    //   : 'http://localhost:3000';

    // fetch(`${API_URL}/signup`, { method: "POST" })
    //   .then(response => response.json())
    //   .then(data => setMessage(data.message))
    //   .catch(error => console.error('Error:', error));
    // db에서 유저 데이터 받아오는 코드
      // 로그인 유지 기능 없어서 임시로 작성해놓은 코드
    fetch(`${API_URL}/hello`)
      .then(response => response.json())
      .then(data => {
                setMessage(data.message)

            }
       )
      .catch(error => console.error('Error:', error));

  }, [])
  // 서버로 데이터 전송하는 함수 handleSignUp
  const handleSignUp = async (signUpData) => {
    try {
      // setUserData(signUpData);

      const response = await fetch(`${API_URL}/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(signUpData)
      });


      const data = await response.json();

      if (response.ok){
        console.log('회원가입 성공:', data.user);
        return response.json();
        setMessage('회원가입이 성공적으로 완료되었습니다.')
        // 여기서 로그인 성공 후 토큰 저장, 리다이렉트 등 로직을 구현합니다.

      } else {
        setMessage(data.message || '회원가입에 실패했습니다. 입력한 정보들을 확인해주세요.');
      }
    } catch (error) {
      console.error('회원가입 에러:', error);
      setMessage('서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
    }
  };


  //   fetch(`${API_URL}/signup`, {
  //     method: "POST",
  //     headers: {
  //       'Content-Type': 'application/json',
  //     },
  //     body: JSON.stringify(userData)
  //   })
  //     .then((response) => {response.json()})
  //     // .then((data) => {setMessage(data.message)})
  //     .catch((error) => {console.error('Error:', error)});
  // }, [])

  // try {
  //   const response = await fetch('/signup', {
  //     method: 'POST',
  //     headers: {
  //       'Content-Type': 'application/json',
  //     },
  //     body: JSON.stringify(userData)
  //   });

  //   const data = await response.json();

  //   if (response.ok) {
  //     console.log('회원가입 성공:', data.user);
  //     // 여기서 로그인 성공 후 토큰 저장, 리다이렉트 등 로직을 구현합니다.
  //     return response.json();
  //   } else {
  //     setErrors(data.message || '회원가입에 실패했습니다. 입력한 정보들을 확인해주세요.');
  //   }
  // } catch (error) {
  //   console.error('회원가입 에러:', error);
  //   setErrors('서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
  // }

  return (
    <div className="App">
      <p>{message}</p>
      <Router>
        <Header user={user}/>
        <Routes>
          <Route path = '/' element = {<Main />}/>
          <Route path = '/board' element = {<Board />}/>
          <Route path = '/login' element = {<Login />}/>
          <Route path = '/signup' element = {<SignUp onSignUp={handleSignUp}/>}/>
          <Route path = '/search' element = {<SearchResultPage/>}/>
          <Route path = '/category/:category' element = {<RecipeList/>}/>
          <Route path = '/recipe/:recipe_id' element = {<RecipeDetail />}/>
          <Route path = '/logout' element={user && <Logout user={user}/>}/>
          <Route element = {<ProtectedPage />}>
            <Route
              path = '/mypage' element = { user ? <UserMyPage
                                                      user={user}
                                                      profilePic={profilePic}
                                                      setProfilePic={setProfilePic}
                                                      loginUser={loginUser}/>
                                                : <Login />}
            />
          </Route>
        </Routes>
      </Router>
      {user && <Chat userData = {user}/>}
      <Footer/>
    </div>
  )
}

export default App;