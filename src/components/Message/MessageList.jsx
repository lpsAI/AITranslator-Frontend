import React from 'react';
import Message from '../Message/Message'

const MessageList = ({ messages, myId }) => {
  return (
    <div className="p-8">
      {messages.map((message, index) => (
        <Message fromLang={message.fromLang} key={index} text={message.text} isUser={message.isUser} id={message.id} myId={myId} />
      ))}
    </div>
  );
}

export default MessageList;
