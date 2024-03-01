export const UserChat = ({chatUserNames}) => {
  return (<div className="p-4 bg-white shadow rounded">
  <h2 className="text-large font-semibold">Chat with: </h2>
  <p className="break-words">{chatUserNames}</p>
</div> )
}