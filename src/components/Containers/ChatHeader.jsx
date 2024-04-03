import axios from "axios";
import { useEffect, useState } from "react";
import { Modalbase } from "../Modal/ModalBase";
import { useAuth } from "../../context/AuthContext";
import { redirect } from "react-router";
import { toast } from "react-toastify";
import { useAppContext } from "../../context/AppContext";
import { Link } from "react-router-dom";
import { SunIcon , MoonIcon } from "@heroicons/react/24/solid";

export const ChatHeader = () => {
  const [theme, setTheme] = useState(() => {
    const savedTheme = localStorage.getItem('theme');
    return savedTheme ? savedTheme : 'light';
  });
  const [languageList, setLanguageList] = useState([]);
  // const [localeLangList, setLocaleLangList] = useState([]);
  const [toClose, setToClose] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchParam] = useState(["langId"]);
  const { onLangChange, currentUser } = useAppContext()

  const { signOut, user } = useAuth()

  const handleLanguageChange = (langId) => {
    onLangChange(langId);
    setToClose(!toClose);
  };

  const handleCloseModal = () => {
    setToClose(!toClose);
  };

  const handleSearchFilter = (list) => {
    return list.filter((item) => {
      return searchParam.some((newItem) => {
        return (
          item[newItem]
            .toString()
            .toLowerCase()
            .indexOf(searchQuery.toLowerCase()) > -1
        );
      });
    });
  };

  useEffect(() => {
    const reqOne = axios.get('https://ai-translator-backend.vercel.app/api/v1/getLang',  {
      headers: {
        'X-Custom-Header': 'foobar'
      }
    });

    const reqTwo = axios.get('https://ai-translator-backend.vercel.app/api/v1/getLocaleLang',  {
      headers: {
        'X-Custom-Header': 'foobar'
      }
    });

    const initAllLanguages = async () => {

      axios.all([reqOne, reqTwo]).then(axios.spread((...res) => {
        res[0].data.languages.sort((a, b) => a.langName.localeCompare(b.langName));
        res[1].data.languageLocale.sort((a, b) => a.label.localeCompare(b.label));
        setLanguageList(res[0].data.languages ?? []);

        const userLang = res[0].data.reqlanguage;
        // setLocaleLangList(res[1].data.languageLocale ?? []);
        localStorage.setItem('list_languages', JSON.stringify(res[0].data.languages));
        localStorage.setItem('locale_list', JSON.stringify(res[1].data.languageLocale));
        localStorage.setItem('default_locale', userLang[0]);
        localStorage.setItem('language', userLang[1]);
      }));


    }

    initAllLanguages();
    localStorage.setItem('theme', theme);
    document.documentElement.setAttribute('data-theme', theme );
  }, [theme]);

  const handleLogout = async () => {
    await signOut()
    toast.info('Logged out successfully!');
    redirect('/login');
  }

  const toggleTheme = () => {
    setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'));
  };


  return (
  <>
  <div className="navbar bg-base-300 sticky top-0">
  <div className="navbar-start">
    <a className="text-lg font-bold">Welcome {currentUser.email ?? user.email}!</a>
    <a className="text-md m-2 text-center cursor-pointer" onClick={() => handleLogout()}>Logout</a>
  </div>
  <div className="navbar-center">
    <a className="text-lg font-bold">LPS AI Translator</a>
  </div>
  <div className="navbar-end">
    <div className="flex items-stretch">
      <ul className="menu menu-horizontal px-1">
        <li><Link className="text-lg m-2 text-center" to={'/'}>Chat</Link></li>
        <li><Link className="text-lg m-2 text-center" to={'/voice'}>Voice</Link></li>
        <li><Link className="text-lg m-2 text-center" to={'/image'}>Image</Link></li>
        <li><a className="text-lg m-2 text-center" type="button" onClick={() => setToClose(true)}>Language <b>{localStorage.getItem('language')}</b></a></li>
        <li><button
          className='text-lg m-2 text-center w-12 h-17 hidden sm:inline'
          color='gray'
          onClick={toggleTheme}
        >
          {theme === 'light' ? <SunIcon /> : <MoonIcon />}
          

        </button></li>
      </ul>
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
