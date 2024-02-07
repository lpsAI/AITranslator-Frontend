import { useState } from "react";
import { ButtonBase } from "../Buttons/ButtonBase"

export const ChatInput = ({sendMsg}) => {
  const [message, setMessage] = useState('');

  const onSendMsg = (event) => {
    setMessage(event.target.value)
  }

  const uponSubmit = (event) => {
    event.preventDefault();
    setMessage('')
    if (message) {
      sendMsg(message)
    }
  }

  return ( <div className="container width-fit">
  <form onSubmit={event => uponSubmit(event)} className="form-control w-full flex flex-row justify-between">
  <input className="input focus:border-none input-primary p-2 mx-2 mt-auto w-4/5" value={message}
        placeholder="type text here" type="text" onChange={(event) => onSendMsg(event)} />
      <ButtonBase label="send" />
  </form>
</div>)
}