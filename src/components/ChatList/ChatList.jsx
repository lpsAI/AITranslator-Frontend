import { Chatbubble } from "../Chatbubble/ChatBubble"

export const ChatList = ({list}) => {
  return (<>
    {list.map((msg, index) => {
      return <li>
          <div className="flex justify-end">
            <Chatbubble key={index} text={msg} pos="start" bgColor="secondary" />
          </div>
        </li>
    })}
  </>)
}