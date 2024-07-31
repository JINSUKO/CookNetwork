import React, { useState, useEffect } from 'react'
import './App.css'
import SignUp from "./pages/SignUp.jsx";
import UserPage from "./pages/UserPage.jsx";

function App() {
  const [message, setMessage] = useState('&nbsp')
    const [user, setUser] = useState(null);

  useEffect(() => {
    const API_URL = import.meta.env.PROD
      ? ''
      : 'http://localhost:3000';

    fetch(`${API_URL}/hello`)
      .then(response => response.json())
      .then(data => {
            setMessage(data.message)
            console.log(data.user)
            setUser(data.user)
            }
       )
      .catch(error => console.error('Error:', error));
  }, [])

  return (
    <div className="App">
      {/*<h1>React App</h1>*/}
      {/*<p>{message}</p>*/}
      {/*<SignUp/>*/}

        {
            user && <UserPage user={user}/>
        }
    </div>

  )
}

export default App