/*
기존 src/App.jsx에 loader 기능을 적용
*/

import React from 'react'
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Main from './pages/Main'
import SignUp from './pages/SignUp'
import Header from './components/Layout/Header'
import Footer from './components/Layout/Footer'
import Login from './pages/Login'
import Korean from './pages/Korean';
import Western from './pages/Western';
import Chinese from './pages/Chinese';
import Japanese from './pages/Japanese';
import RecipeDetail from './components/RecipeDetail'
import Chat from "./chat/chatIndex";
import UserMyPage from "./pages/UserMyPage.jsx";
import SearchResultPage from './components/SearchResult.jsx';

import './App.css'

const API_URL = 'http://192.168.0.13:3000';

// 검색 결과를 로드하는 함수
async function searchLoader({ request }) {
  const url = new URL(request.url);
  const query = url.searchParams.get('q');
  if (!query) return { results: [] };

  try {
    const response = await fetch(`${API_URL}/search?query=${encodeURIComponent(query)}`);
    if (!response.ok) {
      throw new Error('검색 요청에 실패했습니다.');
    }
    const results = await response.json();
    return { results };
  } catch (error) {
    console.error('검색 중 오류 발생:', error);
    return { error: '검색 중 오류가 발생했습니다. 다시 시도해 주세요.' };
  }
}

const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <>
        <Header />
        <Main />
        <Chat />
        <Footer />
      </>
    ),
  },
  {
    path: '/search',
    element: (
      <>
        <Header />
        <SearchResultPage />
        <Chat />
        <Footer />
      </>
    ),
    loader: searchLoader,
  },
  // 다른 라우트들도 비슷한 방식으로 정의...
]);

function App() {
  return (
    <div className="App">
      <RouterProvider router={router} />
    </div>
  )
}

export default App;