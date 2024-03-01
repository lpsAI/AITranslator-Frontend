import { useState } from "react"
import { supabase } from "../../SupabaseClient"
import { useAppContext } from "../../context/AppContext";
import { UserChat } from "../Card/UserChat";
import { toast } from "react-toastify";

export const ChatOverviewList = ({chatIdListener}) => {
  const [newUser, setNewUser] = useState('');
  const { chats, currentUser } = useAppContext()

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
            user_id: currentUser.id
          },  {
            chat_id: chatData.data.id,
            user_id: otherUserData[0].id
          }])

          if (error) {
            toast.error(error.message);
            return;
          }

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
      <div className="p-4 w-full bg-gray-100 shadow rounded flex flex-col">
        <input type="email" placeholder="Enter Email" value={newUser} onChange={e => setNewUser(e.target.value)} className="input my-3 w-ful input-ghost w-full"/>
        <button type="button" className="btn btn-active bg-gray-200 rounded p-2 hover:bg-gray-300" onClick={(e) => createChatWithUser(e)}>Create chat</button>
        <ul className="list-none py-2">
        {chats && chats.map((aChat, index) => (<li key={index}>
          <a onClick={() => chatIdListener(aChat.id, formatEmail(aChat.users, currentUser))}><UserChat chatUserNames={formatEmail(aChat.users, currentUser)} /></a>
        </li>))}
        </ul>
    </div>
  </div>)
}

const formatEmail = (chat, currentUser) => {
  if (chat instanceof Array) {
    return chat.map((user) => {
      return user.user instanceof Array ? user.user[0].email : user.user.email;
    }).filter(email => email !== currentUser.email).join(", ");
  }
  return "";
}