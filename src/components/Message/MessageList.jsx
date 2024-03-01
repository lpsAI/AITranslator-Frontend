import Message from '../Message/Message'

const MessageList = ({ messages, otherUser }) => {
  return (
    <div className="p-4">
      <h1 className="font-bold">{otherUser}</h1>
      {messages && messages.length != 0 ? messages.map((message, index) => (
        <Message fromLang={message.fromLang} key={index} text={message.content} time={message.created_ts} otherUser={otherUser} myId={message.author_id} />
      )) : <h1>No Messages</h1>
      
      }
    </div>
  );
}

export default MessageList;
