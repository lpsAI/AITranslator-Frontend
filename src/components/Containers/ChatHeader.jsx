import { useEffect, useState } from "react"

export const ChatHeader = () => {
  const [languageList, setLanguageList] = useState([]);
  const [language, setLanguage] = useState('');

  useEffect(() => {
    // TODO LIST OF LANGUAGE
  });

  return (<div className="navbar bg-base-100 sticky top-0">
  <div className="flex-1">
    <a className="btn btn-ghost text-xl">LPS AI Translator</a>
  </div>
  <div className="flex-none">
    <ul className="menu menu-horizontal px-1">      
      <li>
        <details>
          <summary>
            Language
          </summary>
          <ul className="p-2 bg-base-100 rounded-t-none">
            <li><a>Link 1</a></li>
            <li><a>Link 2</a></li>
          </ul>
        </details>
      </li>
      <li><a>Logout</a></li>
    </ul>
  </div>
</div>)
}