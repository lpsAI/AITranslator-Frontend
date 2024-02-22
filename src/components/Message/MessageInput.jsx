import React, { useRef, useState } from "react";
import { PaperAirplaneIcon, PhotoIcon } from "@heroicons/react/24/solid";
import axios from "axios";
import { toast } from "react-toastify";

const MessageInput = ({ addMessage }) => {
  const [text, setText] = useState("");
  const toastId = React.useRef(null);

  function handleUpload(file) {
    if (!file) {
      toast.error("No File Selected!", {
        position: "top-right",
        autoClose: 3000
      });
      return;
    }
    const fd = new FormData();
    fd.append("file", file);

    axios
      .post("https://ai-translator-backend.vercel.app/api/v1/upload", fd, {
        onUploadProgress: (progressEvent) => {
          const progress = progressEvent.loaded / progressEvent.total;

          if (toastId.current === null) {
            toastId.current = toast('Upload in Progress', { progress });
          } else {
            toast.update(toastId.current, { progress });
          }
        },
        headers: {
          "Custom-Header": "value",
        },
      })
      .then(() => {
        toast.done(toastId);
        toast.success("Upload Successful!", {
          position: "top-right",
          autoClose: 3000
        });      
      })
      .catch((err) => {
        toast.done(toastId);
        toast.error(`Upload failed: ${err.message}`, {
          position: "top-right",
          autoClose: 3000
        });
        console.error(err);
      });
  }

  
    
    const hiddenFileInput = useRef(null);
    
    const handleChange = event => {
      handleUpload(event.target.files[0])
    };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (text.trim() !== "") {
      addMessage(text, true);
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="container mx-auto py-4 p-8">
        <div className="relative">
          <input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="w-11/12 mb-2 border border-gray-300 rounded-md p-2 outline-none"
            placeholder="Type your message..."
          />
          <div className="absolute right-0 top-1/2 transform -translate-y-1/2 flex space-x-2 -my-1">
            <PaperAirplaneIcon className="h-8 w-8 text-blue-500 mx-2" />

            <input
              className="hidden"
              onChange={event => handleChange(event)}
              ref={hiddenFileInput}
              type="file"
            />
            <button onClick={() => hiddenFileInput.current.click()}>
              <PhotoIcon className="h-8 w-8 text-blue-500" />
            </button>
          </div>
        </div>
      </form>
    </>
  );
};

export default MessageInput;
