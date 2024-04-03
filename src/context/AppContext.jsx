import { createContext, useContext, useEffect, useRef, useState } from "react";
import { supabase } from "../SupabaseClient";
import { useAuth } from "./AuthContext";

const AppContext = createContext({});


export const AppContextProvider = ({children}) => {
  let myChannel = null;
  const { user } = useAuth();
  let currentUser = user && user.id ? user : localStorage.getItem('user') != null ? JSON.parse(localStorage.getItem('user')) : {id: '', username: ''};

  const [chats, setChats] = useState([]);
  const [loadingInitial, setLoadingInitial] = useState(true);
  const [error, setError] = useState("");
  const [isInitialLoad, setIsInitialLoad] = useState(false);
  // const [newIncomingChatTrigger, setNewIncomingChatTrigger] = useState(null);
  const scrollRef = useRef();
  const [language, setLanguage] = useState('')


  useEffect(() => {
    getChatsAndUsers();

    return () => {
      if (myChannel) {
        supabase.removeChannel(myChannel);
      }
    }
  }, []);

  useEffect(() => {
    // Effect to scroll to bottom on initial message load
    if (isInitialLoad) {
      setIsInitialLoad(false);
      scrollToBottom();
    }
  }, []);

  const getChatsAndUsers = async () => {

    await getInitialChats();

    if (!myChannel) {
      myChannel = supabase
      .channel("lps_chat")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "chats" },
        async () => {
          await getInitialChats();
        }
      )
      .subscribe();
    }
    
  }

  const getInitialChats = async () => {
    if (currentUser.id != '') {
      // get all chats where the current user is a member
    // const { data: chatIds } = await 
    
    
    supabase
    .from('chats')
    .select('id, users:users!inner(user_id)')
    .eq('users.user_id', currentUser.id).then(resData => {
      // get all chats with the user profiles
      supabase
      .from('chats')
      .select('*, users:users!inner(user:profiles(email))')
      .in('id', [resData.data.map(chat => chat.id)]).then(users => {
        setLoadingInitial(false);
        setIsInitialLoad(true);
        setChats(users.data);
      }, error => {
        setError(error.message);
        return;
      });
    });
    }
  }

  // const handleNewChat = (payload) => {
  //   setChats((prevMessages) => [...prevMessages, payload]);
  //   //* needed to trigger react state because I need access to the username state
  //   setNewIncomingChatTrigger(payload);
  // };

  const scrollToBottom = () => {
    if (!scrollRef.current) return;

    scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }

  const onLangChange = (langId) => {
    localStorage.setItem("language", langId);
    setLanguage(langId);
  }


  return (<AppContext.Provider
        value={{
          chats,
          loadingInitial,
          error,
          getChatsAndUsers,
          scrollRef,
          scrollToBottom,
          currentUser,
          onLangChange,
          language,
          setLanguage
        }}>{children}</AppContext.Provider>)
}

export const useAppContext = () => {
  return useContext(AppContext);
}
