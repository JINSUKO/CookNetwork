import React, { useState, useEffect } from 'react'
import './App.css'

function App() {
  const [message, setMessage] = useState('&nbsp')

  useEffect(() => {
    const API_URL = import.meta.env.PROD
      ? '/api'
      : 'http://localhost:3000/api';

    fetch(`${API_URL}/hello`)
      .then(response => response.json())
      .then(data => setMessage(data.message))
      .catch(error => console.error('Error:', error));
  }, [])

  return (
    <div className="App">
      <h1>React App</h1>
      <p>{message}</p>
    </div>
  )
}

export default App