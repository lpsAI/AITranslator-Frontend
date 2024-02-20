import React, { useEffect, useState } from 'react';
import MessageList from '../components/Message/MessageList';
import MessageInput from '../components/Message/MessageInput';
import { io } from 'socket.io-client';

const openSocket = io(import.meta.env.SOCKET_URL ?? 'http://localhost:3000');

const ChatScreen = () => {

    const [messages, setMessages] = useState([]);

    const addMessage = (text, isUser = true) => {
      openSocket.emit('sendMessage', {text, isUser, id: openSocket.id});
      // setMessages(prevMessages => [...prevMessages, { text, isUser }]);
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
    <div className="bg-gray-100 min-h-screen flex flex-col justify-between">
      <div className="container mx-auto py-8">
        <MessageList messages={messages} myId={openSocket.id} />
      </div>
      <MessageInput addMessage={addMessage} />
    </div>
  )
}

export default ChatScreen