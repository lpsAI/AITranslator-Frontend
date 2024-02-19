import React, { useState } from 'react';
import MessageList from '../components/Message/MessageList';
import MessageInput from '../components/Message/MessageInput';

const ChatScreen = () => {

    const [messages, setMessages] = useState([]);

    const addMessage = (text, isUser = true) => {
    setMessages(prevMessages => [...prevMessages, { text, isUser }]);
    };
  return (
    <div className="bg-gray-100 min-h-screen flex flex-col justify-between">
      <div className="container mx-auto py-8">
        <h1 className="text-2xl font-semibold text-center mb-4 padding">LPS AI Translator</h1>
        <MessageList messages={messages} />
      </div>
      <MessageInput addMessage={addMessage} />
    </div>
  )
}

export default ChatScreen