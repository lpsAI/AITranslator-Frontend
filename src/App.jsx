import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { ChatInput } from './components/Chatbar/ChatInput'
import { ChatList } from './components/ChatList/ChatList'

import Card from './Card.jsx'

function App() {
  function toggleTheme(){
    document.documentElement.classList.toggle("dark");
    setDarkMode(!darkMode)
  }
  const [darkMode,setDarkMode] = useState(false)
  const [listOfMessage, setListOfMesages] = useState([])

  const onMessageSent = (message) => {
    setListOfMesages([...listOfMessage, message])
  }
  const styles = {
    'color': darkMode? 'red' : 'black'
  }
  return (
   <div className="dark:bg-black">
    <main className='flex size-full' >
      <div className='container w-1/5'>
        <Card></Card>
        <label className="flex cursor-pointer gap-2">
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.2 4.2l1.4 1.4M18.4 18.4l1.4 1.4M1 12h2M21 12h2M4.2 19.8l1.4-1.4M18.4 5.6l1.4-1.4"/></svg>
  <input onClick= {toggleTheme} type="checkbox" value="synthwave" className="toggle theme-controller"/>
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>
</label>
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
    </div>
   
  )
 
  
}

export default App
