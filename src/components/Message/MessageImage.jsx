import { useCallback, useState } from "react";
import { useAppContext } from "../../context/AppContext";
import dayjs from 'dayjs';
import axios from "axios";

const defaultLang = localStorage.getItem('language');

export const MessageImage = ({ imgUrl, myId, otherUser, time, content, fromLang }) => {
  const [toShowTrans, setToShowTrans] = useState(false);
  const [transText, setTransText] = useState('');
  const { currentUser, language } = useAppContext();

  const translateAPI = useCallback( async (text, language) => {
    const response = await axios.post("https://ai-translator-backend.vercel.app/api/v1/ai",{
      text: content, 
      language: language ?? defaultLang, 
      fromLang
    } , {
      headers: {'X-Custom-Header': 'foobar'}
    });

    setTransText(response.data.translations[0].text ?? text)
  }, [fromLang, content])

  const handleTranslation = () => {
    if (toShowTrans) {
      setTransText('');
    } else {
      translateAPI(content, language)
    }
    setToShowTrans(prev => !prev)
  }

  return <>
    <div className={`chat ${myId === currentUser.id ? 'chat-end' : 'chat-start'}`}>
      <div className="chat-header flex items-center">
        <p className="mr-2">{myId === currentUser.id ? 'You' : otherUser}</p>
        <time className="text-xs opacity-50">{dayjs(time).format('DD/MM/YYYY')}</time>
      </div>
      <div className={`chat-bubble p-2 ${myId === currentUser.id ? 'chat-bubble-primary' : ''}`}>
        <div className="container w-full h-auto">
          <img src={imgUrl} alt="trans_img" className="object-fill w-full h-screen rounded-lg" />
        </div>
        {content && <>
          <div className="m-4">
            <h2 className="text-lg font-bold">{toShowTrans ? 'Translated text' : 'Detected text'}</h2>
            <p>{transText !== '' ? transText : content}</p>
          </div>
          <div className="flex justify-end my-2">
            <button className={`btn ${toShowTrans ? 'btn-ghost' : 'btn-secondary'}`} onClick={() => handleTranslation()}>{toShowTrans ? 'See Original' : 'Show Translated'}</button>
          </div>
        </>}
      </div>
    </div>
  </>
}