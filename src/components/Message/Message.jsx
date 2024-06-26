import axios from 'axios';
import { useCallback, useState } from 'react';
import { useAppContext } from '../../context/AppContext';
import dayjs from 'dayjs';

const defaultLang = localStorage.getItem('language');

const Message = ({ text, fromLang, myId, otherUser, time }) => {
  const [transText, setTransText] = useState('');
  const { currentUser, language } = useAppContext();

  const translateAPI = useCallback( async (text, language) => {
    const response = await axios.post("https://ai-translator-backend.vercel.app/api/v1/ai",{
      text, 
      language: language ?? defaultLang, 
      fromLang
    } , {
      headers: {'X-Custom-Header': 'foobar'}
    });

    setTransText(response.data.translations[0].text ?? text)
  }, [fromLang])

  const toggleTranslation = () => {
    if (transText != '') {
      setTransText('');
    } else {
      translateAPI(text, language)
    }
  }

  return (
    // <div className={`flex flex-col ${myId === currentUser.id ? 'items-end' : 'items-start'}`}>
    //   <p className='font-bold text-base'>{myId === currentUser.id ? 'You' : otherUser}</p>
    //   <div className={`flex ${myId === currentUser.id ? 'justify-end' : 'justify-start'} mb-2`}>
    //     <div className={`rounded-lg p-2 ${myId === currentUser.id ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-800'}`}>
    //       {transText ? transText : <span className="loading loading-dots loading-md"></span>}
    //     </div>
    //   </div>
    // </div>
    <>
    <div className={`chat ${myId === currentUser.id ? 'chat-end' : 'chat-start'}`}>
      <div className="chat-header flex items-center">
        <p className='mr-2'>{myId === currentUser.id ? 'You' : otherUser}</p>
        <time className="text-xs opacity-50">{dayjs(time).format('DD/MM/YYYY')}</time>
      </div>
      <div className={`chat-bubble ${myId === currentUser.id ? 'chat-bubble-primary' : ''}`}>{transText !== '' && fromLang !== language ? transText : text}</div>
      {language !== fromLang && <div className="chat-footer">
        <span className='text-primary underline cursor-pointer' onClick={()=> toggleTranslation()}>{transText !== '' ? 'Original' : 'Translate'}</span>
      </div>}
    </div>
    </>
  );
}

export default Message;
