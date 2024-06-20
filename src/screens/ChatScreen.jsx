import { memo, useCallback, useEffect, useState } from 'react';
import MessageList from '../components/Message/MessageList';
import MessageInput from '../components/Message/MessageInput';
import { ChatOverviewList } from '../components/ChatList/ChatOverviewList';
import { supabase } from '../SupabaseClient';

const ChatScreen = memo(() => {
  const [chatId, setChatId] = useState('');
  const [chatUser, setChatUser] = useState('');

  const [messages, setMessages] = useState([]);

  const getAllMessages = useCallback(async () => {
    if (chatId) {
      const {data, error} = await supabase.from("messages").select("*").eq("chat_id", chatId);
      if (error) {
        setMessages([])
      } else {
        if (data && data.length != 0) {
          setMessages([...data]);
        }
      }
    }
  }, [chatId])

  useEffect(() => {
    const msgSubscription = supabase
        .channel('lps_chat')
        .on("postgres_changes", { event: "*", schema: "public", table: "messages" },  (newMsgs) => {
          setMessages(prevMsgs => [...prevMsgs, newMsgs.new]);
    })
    .subscribe();

    getAllMessages();

    return () => {
      msgSubscription.unsubscribe();
    }
  }, [getAllMessages]);

  const handleChatId = (chatId, email) => {
    setChatId(chatId);
    setChatUser(email)
  }


  const [isVisible, setIsVisible] = useState(true);

  const hideContainer = () => {
    setIsVisible(false);
  };

  return (
    <div className="w-full h-[85vh] max-sm:p-3 max-sm:items-center max-sm:justify-center flex flex-row">
      {!isVisible && ( <button onClick={() => setIsVisible(!isVisible)}>
        {isVisible ? 'Hide' : 'Show'} Container
      </button>)}
      {isVisible && (
      <div className="h-auto container sm:w-3/12 bg-primary">
      <button className="close-button" onClick={hideContainer}>X</button>
        <ChatOverviewList chatIdListener={handleChatId} />
      </div>
       )}
      {chatId && <div className="flex flex-col w-9/12">
        <div className="bg-base-200 overflow-auto container mx-auto py-8 h-full">
          <MessageList messages={messages} otherUser={chatUser} />
        </div>
        <MessageInput chatId={chatId} />
      </div>}
    </div>
  )
})

ChatScreen.displayName = 'ChatScreen';

export default ChatScreen