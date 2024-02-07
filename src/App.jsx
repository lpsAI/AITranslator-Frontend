import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { ChatInput } from './components/Chatbar/ChatInput'
import { ChatList } from './components/ChatList/ChatList'

function App() {
  const [listOfMessage, setListOfMesages] = useState([])

  const onMessageSent = (message) => {
    setListOfMesages([...listOfMessage, message])
  }

  return (
    <main className='flex size-full'>
      <div className='container w-1/5'>
        <h1>testing it out</h1>
      </div>
      <div className='container w-4/5'>
        <div className='container max-w-full flex flex-col h-screen'>
          <ul className="list-none max-w-full h-full">
            <ChatList list={listOfMessage} />
          </ul>
          <ChatInput sendMsg={onMessageSent} />
        </div>
      </div>
     
    </main>
  )
}

export default App
