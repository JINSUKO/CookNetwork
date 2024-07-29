import React, { useState, useEffect } from 'react'
import Main from './pages/Main'
import SignUp from './pages/SignUp'
import './App.css'
import Login from './pages/Login'

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
      <p>{message}</p>
      <Main />
      <SignUp />
      <Login/>
    </div >
  )
}

export default App;