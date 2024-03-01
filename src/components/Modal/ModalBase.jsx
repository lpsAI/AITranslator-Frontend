export const Modalbase = ({toOpen, isModalOpen, children}) => {
  const handleCloseModal = () => {
    toOpen()
  }

  return <div className={`${isModalOpen ? 'flex' : 'hidden'} fixed justify-center z-10 left-0 top-0 w-full h-full overflow-auto bg-gray-300/50`}>
  <div className="m-2 p-5 w-screen container text-right block h-fit mx-3 my-5 bg-white">
    <span className="text-black text-xl font-bold" onClick={() => handleCloseModal()}>&times;</span>
    {children}
  </div>
</div>
}