import React, { useRef, useState } from "react";
import { PaperAirplaneIcon, PhotoIcon } from "@heroicons/react/24/solid";
import axios from "axios";

const MessageInput = ({ addMessage }) => {
  const [text, setText] = useState("");
  const [file, setFile] = useState(null);
  //const [progress, setProgress] = useState({ started: false, pc: 0 });
  //const [msg, setMsg] = useState(null);

  function handleUpload() {
    if (!file) {
      //setMsg("No file selected");
      return;
    }
    const fd = new FormData();
    fd.append("file", file);
    //setMsg("Uploading...");
    //setProgress((prevState) => {
      //return { ...prevState, started: true };
    //});

    axios
      .post("https://ai-translator-backend.vercel.app/api/v1/upload", fd, {
        //onUploadProgress: (progressEvent) => {
          //setProgress((prevState) => {
            //return { ...prevState, pc: progressEvent.progress * 100 };
          //});
        //},
        headers: {
          "Custom-Header": "value",
        },
      })
      .then((res) => {
        //setMsg("Upload Successful");
        console.log(res.data);
      })
      .catch((err) => {
        //setMsg("Upload failed");
        console.error(err);
      });
  }

  
    
    const hiddenFileInput = useRef(null);

    const handleClick = () => {
      hiddenFileInput.current.click();
    };
    
    const handleChange = event => {
      const fileUploaded = event.target.files[0];
      setFile(fileUploaded);
      handleUpload()
    };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (text.trim() !== "") {
      addMessage(text, true);
      setText("");
    }
  };

  return (
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
            onChange={handleChange}
            ref={hiddenFileInput}
            type="file"
          />
          <button onClick={handleClick}>
            <PhotoIcon className="h-8 w-8 text-blue-500" />
          </button>
        </div>
      </div>
    </form>
  );
};

export default MessageInput;
