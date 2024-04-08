import { useState } from "react"
import { supabase } from "../../SupabaseClient"
import { useAppContext } from "../../context/AppContext";
import { UserChat } from "../Card/UserChat";
import { toast } from "react-toastify";
import { useAuth } from "../../context/AuthContext";

export const ChatOverviewList = ({chatIdListener}) => {
  const [newUser, setNewUser] = useState('');
  const { chats, currentUser } = useAppContext()
  const { user } = useAuth();

  const createChatWithUser = async (e) => {
    e.preventDefault();

    if (!newUser.trim()) {
      toast.error('Please input an email');
    }

    try {
      const { data: otherUserData } = await supabase
      .from('profiles')  
      .select('id')
      .eq('email', newUser)


      if (otherUserData && otherUserData.length != 0) {
        supabase.from('chats').insert({}).select().single().then(async chatData => {

          const { error } = await supabase
          .from('users')
          .insert([{
            chat_id: chatData.data.id,
            user_id: user.id ?? currentUser.id
          },  {
            chat_id: chatData.data.id,
            user_id: otherUserData[0].id
          }])

          if (error) {
            toast.error(error.message);
            return;
          }

          setNewUser('');
          toast.success(`New chat with ${newUser}!`)
        }, error => {
          toast.error(error.message);
        })

        
      }
    } catch (error) {
      toast.error(error);
    }
  }

  return (<div className="p-8 space-y-2">
      <div className="p-4 w-full shadow rounded flex flex-col">
        <input type="email" placeholder="Enter Email" value={newUser} onChange={e => setNewUser(e.target.value)} className="input bg-secondary my-3 w-ful input-ghost w-full"/>
        <button type="button" className="btn bg-secondary btn-active  rounded p-2 " onClick={(e) => createChatWithUser(e)}>Create chat</button>
        <h2 className="text-large font-semibold my-2">Chat with: </h2>
        <ul className="list-none py-2">
        {chats && chats.map((aChat, index) => (<li key={index}>
          <a onClick={() => chatIdListener(aChat.id, formatEmail(aChat.users, currentUser, user))}><UserChat chatUserNames={formatEmail(aChat.users, currentUser)} /></a>
        </li>))}
        </ul>
    </div>
  </div>)
}

const formatEmail = (chat, currentUser, defaultUser) => {
  if (chat instanceof Array) {
    return chat.map((aUser) => {
      return aUser.user instanceof Array ? aUser.user[0].email : aUser.user.email;
    }).filter(email => email !== (currentUser.email ?? defaultUser.email)).join(", ");
  }
  return "";
}