import './App.css'
// import LoginScreen from './screens/LoginScreen'
import ChatScreen from './screens/ChatScreen'
import { ChatHeader } from './components/Containers/ChatHeader'
import 'react-toastify/dist/ReactToastify.min.css';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import { SpeechScreen } from './screens/SpeechScreen';
import LoginScreen from './screens/LoginScreen';
import { AuthProvider } from './context/AuthContext';
import { ProtectedScreen } from './screens/ProtectedScreen';
import { AppContextProvider } from './context/AppContext';
import { ToastContainer } from 'react-toastify';
import { SuspenseContent } from './components/Suspense/SuspenseContent';
import { TextOnImageScreen } from './screens/TextOnImageScreen';

function App() {

  const router = createBrowserRouter([{
    path: '/',
    element: <ProtectedScreen />,
    children: [
      {
        path: '/',
        element: <><ChatHeader /><ChatScreen /></>
      }, {
        path: '/voice',
        element: <><ChatHeader /><SpeechScreen /></>
      }, {
        path: '/image',
        element: <><ChatHeader /><TextOnImageScreen /></>
      }]
  },
  {
    path: 'login',
    element: <LoginScreen />
  }])
  return (
    <>
      <div className="w-screen mx-auto">
        {/* <LoginScreen/> */}
        {/* <ChatScreen/> */}
        <AuthProvider>
          <AppContextProvider>
            <RouterProvider router={router} fallbackElement={SuspenseContent} />
          </AppContextProvider>
        </AuthProvider>
      </div>
      <ToastContainer />
    </>
  )
}
export default App