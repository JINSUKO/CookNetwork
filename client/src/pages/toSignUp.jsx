
import React, { useState, useEffect } from 'react'

function toSignUp() {
  const [message, setMessage] = useState('　')

  useEffect(() => {
    const API_URL = import.meta.env.PROD
      ? ''
      : 'http://192.168.0.103:3000';

    console.log(API_URL)

    fetch(`${API_URL}/signup`, { method: "POST" })
      .then(response => response.json())
      .then(data => setMessage(data.message))
      .catch(error => console.error('Error:', error));
  }, [])

  return (
    <div className="SignUp">
      <p>{message}</p>
      <SignUp />
    </div>
  )
}

export default toSignUp;