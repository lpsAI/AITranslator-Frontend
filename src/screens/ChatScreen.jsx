import React, { useEffect, useState } from 'react';
import MessageList from '../components/Message/MessageList';
import MessageInput from '../components/Message/MessageInput';
import axios from 'axios';
import { io } from 'socket.io-client';

const openSocket = io(import.meta.env.SOCKET_URL ?? 'http://localhost:3000');

const ChatScreen = () => {

    const [messages, setMessages] = useState([]);

    const addMessage = async (text, isUser = true) => {
    
      const response = await axios.post("https://ai-translator-backend.vercel.app/api/v1/ai",{
        text, 
        language: "zh-Hans"
      } , {
        headers: {'X-Custom-Header': 'foobar'}
      }) 

      const data = response.data.translations[0].text

      openSocket.emit('sendMessage', {text: data, isUser, id: openSocket.id});

      // setMessages(prevMessages => [...prevMessages, { text:data, isUser }]);
    
    };

    useEffect(() => {
      const broadcastMsg = ({text, isUser, id}) => {
        setMessages([...messages, { text, isUser, id }]);
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
}

export default ChatScreen