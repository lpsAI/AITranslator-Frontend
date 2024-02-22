import axios from "axios";
import { useEffect, useState } from "react"
import { Modalbase } from "../Modal/ModalBase";

export const ChatHeader = () => {
  const [languageList, setLanguageList] = useState([]);
  const [toClose, setToClose] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchParam] = useState(['langId']);


  const handleLanguageChange = (langId) => {
    localStorage.setItem('language', langId);
    setToClose(!toClose);
  }

  const handleCloseModal = () => {
    setToClose(!toClose);
  }

  const handleSearchFilter = (list) => {
    return list.filter(item => {
      return searchParam.some((newItem) => {
        return (item[newItem].toString()
        .toLowerCase()
        .indexOf(searchQuery.toLowerCase()) > -1)
      })
    })
  }

  useEffect(() => {
    const initAllLanguages = async () => {
      const response = await axios.get('https://ai-translator-backend.vercel.app/api/v1/getLang',  {
        headers: {
          'X-Custom-Header': 'foobar'
        }
      });

      setLanguageList(response.data.languages ?? []);
    }

    initAllLanguages();
  }, []);

  return (
  <>
  <div className="navbar bg-base-300 sticky top-0">
  <div className="flex-1 px-2 lg:flex-none">
    <a className="text-lg font-bold">LPS AI Translator</a>
  </div>
  <div className="flex justify-end flex-1 px-2">
    <div className="flex items-stretch">
      <button type="button" onClick={() => setToClose(true)} className="btn btn-ghost rounded-btn text-lg">Language <b>{localStorage.getItem('language')}</b></button>
    </div>
  </div>
</div>
<Modalbase toOpen={() => handleCloseModal()} isModalOpen={toClose}>
  <label className="input input-bordered flex items-center gap-2 w-full my-2">
    <input type="text" value={searchQuery} onChange={(event) => setSearchQuery(event.target.value.trim())} className="grow" placeholder="Search Language" />
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="w-4 h-4 opacity-70"><path fillRule="evenodd" d="M9.965 11.026a5 5 0 1 1 1.06-1.06l2.755 2.754a.75.75 0 1 1-1.06 1.06l-2.755-2.754ZM10.5 7a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z" clipRule="evenodd" /></svg>
  </label>
  {handleSearchFilter(languageList).length != 0 ? (<ul tabIndex={0} className="container flex flex-wrap justify-between">
    {handleSearchFilter(languageList).map((aLang, index) => {
        return <li key={index} className="w-auto p-1 m-1" onClick={() => handleLanguageChange(aLang.langId)}><a className="btn text-left text-lg">{aLang.langName}</a></li>
    })}
  </ul>) : (<p className="text-center text-lg">No language available</p>)}
</Modalbase>

</>)
}