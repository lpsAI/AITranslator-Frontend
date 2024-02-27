import { memo, useEffect, useState } from 'react';
import MessageList from '../components/Message/MessageList';
import MessageInput from '../components/Message/MessageInput';
import { io } from 'socket.io-client';

const openSocket = io(import.meta.env.SOCKET_URL ?? 'http://localhost:3000');

const ChatScreen = memo(() => {

    const [messages, setMessages] = useState([]);
    const language =  localStorage.getItem('language');

    const addMessage = async (text, isUser = true) => {
      openSocket.emit('sendMessage', {text, isUser, id: openSocket.id, fromLang: language});

      // setMessages(prevMessages => [...prevMessages, { text:data, isUser }]);
    
    };

    useEffect(() => {
      const broadcastMsg =  ({text, isUser, id, fromLang}) => {
        setMessages([...messages, { text, isUser, id, fromLang }]);
      }

      openSocket.on('message', (remoteMsg) => broadcastMsg(remoteMsg));

      return () => {
        openSocket.off('message', (remoteMsg) => broadcastMsg(remoteMsg))
      }
    }, [messages]);

  return (
    <div className="bg-gray-100 container h-[92vh] flex flex-col">
      <div className="container mx-auto py-8 h-full">
        <MessageList messages={messages} myId={openSocket.id} />
      </div>
      <MessageInput addMessage={addMessage} />
    </div>
  )
})

ChatScreen.displayName = 'ChatScreen';

export default ChatScreen