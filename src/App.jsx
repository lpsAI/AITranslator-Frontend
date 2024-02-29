import './App.css'
// import LoginScreen from './screens/LoginScreen'
import ChatScreen from './screens/ChatScreen'
import { ChatHeader } from './components/Containers/ChatHeader'
import 'react-toastify/dist/ReactToastify.min.css';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import { SpeechScreen } from './screens/SpeechScreen';

function App() {
  
  const router = createBrowserRouter([{
    path: '/',
    element: <ChatScreen />
  }, {
    path: 'speech',
    element: <SpeechScreen />
  }])
  return (
    <>
      <ChatHeader />
      <div className="container mx-auto">
          {/* <LoginScreen/> */}
          {/* <ChatScreen/> */}
          <RouterProvider router={router} />
      </div>
    </>
  )
}
export default App