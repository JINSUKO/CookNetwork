/* Navbar.jsx
내비게이션바는 react-router-dom 라이브러리 사용 (npm install react-router-dom)
*/

import React from 'react';
import { Link, BrowserRouter, Routes, Route } from 'react-router-dom';
import '../assets/styles/Navbar.css'

function Navbar() {
  return (
    <div>
      <div className='navbar'>
          <Link className='navbarMenu' to={'/'}>전체</Link>
          <Link className='navbarMenu' to={'/'}>한식</Link>
          <Link className='navbarMenu' to={'/'}>양식</Link>
          <Link className='navbarMenu' to={'/'}>중식</Link>
          <Link className='navbarMenu' to={'/'}>일식</Link>
      </div>
      <Routes>
        <Route path="/all" element={<Main />}/>
        <Route path="/korean" element={<Korean />}/>
        <Route path="/western" element={<Western />}/>
        <Route path="/chinese" element={<Chinese />}/>
        <Route path="/japanese" element={<Japanese />}/>
      </Routes>
    </div>
  )
}

export default Navbar;
