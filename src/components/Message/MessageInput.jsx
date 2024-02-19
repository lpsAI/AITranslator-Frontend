import React, { useState } from 'react';
import { PaperAirplaneIcon, PhotoIcon } from '@heroicons/react/24/solid'

const MessageInput = ({ addMessage }) => {
  const [text, setText] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (text.trim() !== '') {
      addMessage(text, true);
      setText('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="container mx-auto py-4 p-8">
    <div className="relative">
        <input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="w-11/12 mb-2 border border-gray-300 rounded-md p-2 outline-none"
            placeholder="Type your message..."
        />
        <div className="absolute right-0 top-1/2 transform -translate-y-1/2 flex space-x-2 -my-1">
            <PaperAirplaneIcon className="h-8 w-8 text-blue-500 mx-2"  />
            <PhotoIcon className="h-8 w-8 text-blue-500"/>
        </div>
    </div>
</form>

  );
}

export default MessageInput;



