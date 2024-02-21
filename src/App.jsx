import { useState, } from 'react'
import './App.css'
import LoginScreen from './screens/LoginScreen'
import ChatScreen from './screens/ChatScreen'
import { ChatHeader } from './components/Containers/ChatHeader'

function App() {
  localStorage.setItem('language', 'en');
  return (
    <>
      <ChatHeader />
      <div className="container mx-auto">
          {/* <LoginScreen/> */}
          <ChatScreen/>
      </div>
    </>
     
    
  )
}

export default App
