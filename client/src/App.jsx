import React, { useState, useEffect } from 'react'
import Main from './pages/Main'
import SignUp from './pages/SignUp'
import './App.css'
import Login from './pages/Login'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Korean from './pages/Korean';
import Western from './pages/Western';
import Chinese from './pages/Chinese';
import Japanese from './pages/Japanese';


function App() {
  const [message, setMessage] = useState('　')

  useEffect(() => {
    const API_URL = import.meta.env.PROD
      ? ''
      : 'http://localhost:3000';

    // fetch(`${API_URL}/signup`, { method: "POST" })
    //   .then(response => response.json())
    //   .then(data => setMessage(data.message))
    //   .catch(error => console.error('Error:', error));
  }, [])

  return (
    <div className="App">
      {/* <p>{message}</p> */}
      <Router>
        <Routes>
          <Route path = '/' element = {<Main />}/>
          <Route path = '/korean' element = {<Korean />}/>
          <Route path = '/western' element = {<Western />}/>
          <Route path = '/chinese' element = {<Chinese />}/>
          <Route path = '/japanese' element = {<Japanese />}/>
          <Route path = '/login' element = {<Login />}/>
          <Route path = '/signup' element = {<SignUp />}/>
        </Routes>
      </Router>
    </div >

    // <div>
    //   <Main />
    // </div>


  )
}

export default App;