import React, { useState, useEffect } from 'react'
import Main from './pages/Main'
import Board from './pages/Board';
import SignUp from './pages/SignUp'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Layout/Header'
import Footer from './components/Layout/Footer'
import Login from './pages/Login'
import RecipeDetailPage from './pages/RecipeDetailPage'
import OpenChat from "./chat/OpenChat";
import UserMyPage from "./pages/UserMyPage";
import SearchResultPage from './pages/SearchResultPage';
import FetchRecipeList from './components/FetchRecipeList';
import Logout from "./components/Logout";
import ProtectedPage from "./pages/authToken/ProtectedPage";
import Admin from './pages/Admin';

import authFetch from './fetchInterceptorAuthToken';
import authManager from "./authManager";

import { BookmarkProvider } from './context/BookmarkContext';
import BookmarkList from './components/Bookmark/BookmarkList';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Editor from './Editor'
import RecipeWrite from './pages/RecipeWrite';
import MyRecipeList from './pages/MyRecipeList';
import RecipeUpdate from './pages/RecipeUpdate';

import './App.css'
import NotFound from './pages/NotFound';
import Best from './pages/Best'



function App() {
  let loginUser = localStorage.getItem('loginUser');

  const [message, setMessage] = useState('');
  const [user, setUser] = useState(null);
  const [profilePic, setProfilePic] = useState(null); // displayUserProfile 추가 후 지금은 없어도 잘 돌아감.

  console.log('user', user)

  const HOST_IP  = import.meta.env.VITE_HOST_IP
  const API_URL = HOST_IP;

  // 문제 확인: 웹브라우저에서 loginUser 정보를 수정하고 새로고침하면 변경된 정보가 브라우저에 보여진다.
  // 새로고침하면 유저 정보를 서버에서 새로 받아오는 코드를 작성해서 해결하려고 함.
  useEffect(() => {
    if (loginUser) {
      // APP 처음 접근하거나 브라우저 새로고침 하거나 렌더링 새로될 시
      // 사용자 정보 요청 및 사용
      async function displayUserProfile() {

        try {
          const data = await authManager.addRequest(() => authFetch(`${HOST_IP}/api/userInfo/${loginUser}`, {
            method: 'POST',
            body: JSON.stringify({userId: loginUser}),
          }));

          console.log(data.message);

          // 사용자 프로필 표시 로직
          setUser(data.user);
          // setProfilePic(data.user.user_img);

        } catch (e) {
          console.error(e);
        }
      }

      displayUserProfile();
    } else {
      localStorage.removeItem('accessToken');
    }
  }, [loginUser]);




  // 서버로 데이터 전송하는 함수 handleSignUp
  const handleSignUp = async (signUpData) => {
    try {
      // setUserData(signUpData);

      const response = await fetch(`${API_URL}/api/signup`, {
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
  

  return (
    <div className="App">
      <p>{message}</p>
      <Router>
        <BookmarkProvider>
        <Header user={user}/>
        <Routes>
          <Route path = '/' element = {<Main />}/>
          <Route path = '/board' element = {<Board />}/>
          <Route path = '/login' element = {<Login setUser={setUser} setProfilePic={setProfilePic} />}/>
          <Route path = '/signup' element = {<SignUp onSignUp={handleSignUp}/>}/>
          <Route path = '/search' element = {<SearchResultPage/>}/>
          <Route path = '/category/:category' element = {<FetchRecipeList/>}/>
          <Route path = '/recipe/:recipe_id' element = {<RecipeDetailPage />}/>
          <Route path = '/logout' element={user && <Logout user={user}/>}/>
          <Route element = {<ProtectedPage />}>
            <Route
              path = '/mypage' element = {user ? <UserMyPage
                                                      user={user}
                                                      setUser={setUser}
                                                      profilePic={profilePic}
                                                      setProfilePic={setProfilePic}/>
                                                : <Login />}
            />
            <Route path='/myrecipe' element={<MyRecipeList user={user}/>}/>
            <Route path='/writerecipe' element={<RecipeWrite user={user}/>} />
            <Route path='/updaterecipe/:recipe_id' element={<RecipeUpdate user={user} />} />
          </Route>
          {/* 추가 중이라서 영자 계정만 접근할 수 있게 막지는 않았습니다.*/}
          <Route path='/admin' element={<Admin />} />

          <Route path='*' element={<NotFound />}/>
          <Route path='/myrecipe' element={<MyRecipeList user={user}/>}/>
          <Route path='/writerecipe' element={<RecipeWrite user={user}/>} />
          <Route path='/updaterecipe/:recipe_id' element={<RecipeUpdate user={user} />} />
          <Route path='/mybookmark' element={<BookmarkList/>} />
          <Route path='/best' element={<Best />} />
        </Routes>
        </BookmarkProvider>
      </Router>
      {user && <OpenChat userData = {user}/>}
      <Footer/>
      <ToastContainer />
    </div>
  )
}

export default App;