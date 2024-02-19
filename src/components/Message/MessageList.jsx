import React from 'react';
import Message from '../Message/Message'

const MessageList = ({ messages }) => {
  return (
    <div className="p-8">
      {messages.map((message, index) => (
        <Message key={index} text={message.text} isUser={message.isUser} />
      ))}
    </div>
  );
}

export default MessageList;
