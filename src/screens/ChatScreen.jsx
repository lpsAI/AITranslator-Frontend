import { memo, useEffect, useState } from 'react';
import MessageList from '../components/Message/MessageList';
import MessageInput from '../components/Message/MessageInput';
import { ChatOverviewList } from '../components/ChatList/ChatOverviewList';
import { supabase } from '../SupabaseClient';

const ChatScreen = memo(() => {
  const [chatId, setChatId] = useState('');
  const [chatUser, setChatUser] = useState('');

  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const getAllMessages = async () => {
      if (chatId) {
        const {data, error} = await supabase.from("messages").select("*").eq("chat_id", chatId);
        if (error) {
          setMessages([])
        } else {
          if (data && data.length != 0) {
            setMessages(oldVals => [...oldVals, ...data]);
          }
        }
      }
    }
    
    const msgSubscription = supabase
        .channel('lps_chat')
        .on("postgres_changes", { event: "*", schema: "public", table: "messages" },  (newMsgs) => {
          setMessages(oldVals => [...oldVals, newMsgs.new]);
    })
    .subscribe();

    getAllMessages();

    return () => {
      msgSubscription.unsubscribe();
    }
  }, [chatId]);

  const handleChatId = (chatId, email) => {
    setChatId(chatId);
    setChatUser(email)
  }

  return (
    <div className="w-full h-[89vh] flex flex-row">
      <div className="h-auto container w-3/12 bg-blue-300">
        <ChatOverviewList chatIdListener={handleChatId} />
      </div>
      {chatId && <div className="flex flex-col w-9/12">
        <div className="bg-base-200 container mx-auto py-8 h-full">
          <MessageList messages={messages} otherUser={chatUser} />
        </div>
        <MessageInput chatId={chatId} />
      </div>}
    </div>
  )
})

ChatScreen.displayName = 'ChatScreen';

export default ChatScreen