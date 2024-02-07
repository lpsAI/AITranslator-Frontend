export const Chatbubble = ({text, pos, bgColor}) => {
  
  return (<div className={`chat chat-${pos} my-2`}>
    <div className="chat-header">Ganda</div>
    <div className={`chat-bubble ${getBgColor(bgColor)}`} >{text}</div>
  </div>)  
}

/**
 * 
 * @param {string} type 
 * @returns {string}
 */
const getBgColor = (type) => {
  switch(type) {
    case 'primary': return 'chat-bubble-primary'
    case 'secondary': return 'chat-bubble-secondary'
  }
}