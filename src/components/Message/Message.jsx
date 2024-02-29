import axios from 'axios';
import { useCallback, useEffect, useState } from 'react';

const Message = ({ text, id, myId, fromLang }) => {
  const [transText, setTransText] = useState('');
  const language =  localStorage.getItem('language');

  const translateAPI = useCallback( async (text, language) => {
    const response = await axios.post("https://ai-translator-backend.vercel.app/api/v1/ai",{
      text, 
      language, 
      fromLang
    } , {
      headers: {'X-Custom-Header': 'foobar'}
    });

    setTransText(response.data.translations[0].text)
  }, [fromLang])

  useEffect(() => {
    translateAPI(text, language)
  }, [language, text, translateAPI])

  return (
    <div className={`flex flex-col ${id === myId ? 'items-end' : 'items-start'}`}>
      <p className='font-bold text-base'>{id === myId ? 'You' : id}</p>
      <div className={`flex ${id === myId ? 'justify-end' : 'justify-start'} mb-2`}>
        <div className={`rounded-lg p-2 ${id === myId ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-800'}`}>
          {transText ? transText : <span className="loading loading-dots loading-md"></span>}
        </div>
      </div>
    </div>
  );
}

export default Message;
