import { useEffect, useRef } from 'react';
import Message from '../Message/Message'
import { MessageImage } from './MessageImage';

const MessageList = ({ messages, otherUser }) => {
  const scrollRef = useRef(null);

  useEffect(() => {
    scrollRef.current.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="p-4">
      <h1 className="font-bold">{otherUser}</h1>
      {messages && messages.length != 0 ? messages.map((message, index) => {
        return message.is_image ? 
          <MessageImage 
            fromLang={message.from_lang} 
            key={index} 
            content={message.content} 
            time={message.created_ts} 
            otherUser={otherUser} imgUrl={message.img_url} myId={message.author_id} /> 
          : 
          <Message fromLang={message.from_lang} 
                   key={index} text={message.content} 
                   time={message.created_ts} 
                   otherUser={otherUser} 
                   myId={message.author_id} />        
      }) : <h1>No Messages</h1>}

      <div ref={scrollRef} />
    </div>
  );
}

export default MessageList;
