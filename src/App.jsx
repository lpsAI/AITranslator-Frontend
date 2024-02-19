import { useState, } from 'react'
import './App.css'
import LoginScreen from './screens/LoginScreen'
import ChatScreen from './screens/ChatScreen'

function App() {

  return (
    <div className="container mx-auto">
        {/* <LoginScreen/> */}
        <ChatScreen/>
    </div>
     
    
  )
}

export default App
