import { createContext, useContext, useEffect, useRef, useState } from "react";
import { supabase } from "../SupabaseClient";
import { useAuth } from "./AuthContext";

const AppContext = createContext({});


export const AppContextProvider = ({children}) => {
  let myChannel = null;
  const { user } = useAuth();
  let currentUser = user && user.id ? user : {id: '', username: ''};

  const [chats, setChats] = useState([]);
  const [loadingInitial, setLoadingInitial] = useState(true);
  const [error, setError] = useState("");
  const [isInitialLoad, setIsInitialLoad] = useState(false);
  const [newIncomingChatTrigger, setNewIncomingChatTrigger] = useState(null);
  const scrollRef = useRef();
  const [unviewedChatCount, setUnviewedChatCount] = useState(0);
  const [language, setLanguage] = useState(null)


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

  useEffect(() => {
    if (!newIncomingChatTrigger) return;

    if (newIncomingChatTrigger.username === currentUser.username) {
      scrollToBottom();
    } else {
      setUnviewedChatCount((prevCount) => prevCount + 1);
    }
  }, [newIncomingChatTrigger]);



  const getChatsAndUsers = async () => {

    await getInitialChats();

    if (!myChannel) {
      myChannel = supabase
      .channel("lps_chat")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "chats" },
        (payload) => {
          handleNewChat(payload);
        }
      )
      .subscribe();
    }
    
  }

  const getInitialChats = async () => {
    if (currentUser.id != '') {
      // get all chats where the current user is a member
    const { data: chatIds } = await supabase
    .from('chats')
    .select('id, users:users!inner(user_id)')
    .eq('users.user_id', currentUser.id)

    // get all chats with the user profiles
    const { data, error } =  await supabase
      .from('chats')
      .select('*, users:users!inner(user:profiles(email))')
      .in('id', [chatIds.map(chat => chat.id)])

      setLoadingInitial(false);

      if (error) {
        setError(error.message);
        return;
      }

      setIsInitialLoad(true);
      setChats(data);
    }
  }

  const handleNewChat = (payload) => {
    setChats((prevMessages) => [payload.new, ...prevMessages]);
    //* needed to trigger react state because I need access to the username state
    setNewIncomingChatTrigger(payload.new);
  };

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
          unviewedChatCount,
          currentUser,
          onLangChange,
          language
        }}>{children}</AppContext.Provider>)
}

export const useAppContext = () => {
  return useContext(AppContext);
}
