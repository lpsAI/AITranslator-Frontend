import React from 'react';

const Message = ({ text, isUser, id, myId }) => {
  return (
    <div className={`flex flex-col ${id === myId ? 'items-end' : 'items-start'}`}>
      <p className='font-bold text-base'>{id === myId ? 'You' : id}</p>
      <div className={`flex ${id === myId ? 'justify-end' : 'justify-start'} mb-2`}>
        <div className={`rounded-lg p-2 ${id === myId ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-800'}`}>
          {text}
        </div>
      </div>
    </div>
  );
}

export default Message;
