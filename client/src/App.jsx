import React, { useState, useEffect } from 'react'
import SignUp from './pages/SignUp'
import './App.css'

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
      <SignUp />
    </div >
  )
}

export default App;