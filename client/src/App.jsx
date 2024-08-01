import React, { useState, useEffect } from 'react'
import './App.css'
import SignUp from "./pages/SignUp.jsx";
import Chat from "./chat/chatIndex.jsx";

function App() {
  
  return (
    <div className="App">
      {/*<h1>React App</h1>*/}
      {/*<p>{message}</p>*/}
      {/* <SignUp/> */}
      <Chat/>
    </div>
  )
}

export default App