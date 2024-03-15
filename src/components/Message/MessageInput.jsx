import React, { useRef, useState } from "react";
import { PhotoIcon } from "@heroicons/react/24/solid";
import axios from "axios";
import { toast } from "react-toastify";
import { useAppContext } from "../../context/AppContext";
import { supabase } from "../../SupabaseClient";

const MessageInput = ({ chatId }) => {
  const [text, setText] = useState("");
  const { currentUser, language } = useAppContext()
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
    fd.append('fromLanguage', language ?? localStorage.getItem('language'))

    axios
      .post("https://ai-translator-backend.vercel.app/api/v1/imageAnalyzer", fd, {
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
      .then(async (respData) => {
        try {
          if (respData && respData.data) {
            const { error } = await supabase.from('messages').insert([{
              chat_id: parseInt(chatId),
              author_id: currentUser.id,
              content: respData.data.detectedText,
              from_lang: respData.data.detectedLang,
              is_image: true,
              img_url: respData.data.imageUrl
            }])
    
            if (error) {
              toast.error(error.message);
              return;
            }
  
            toast.done(toastId);
            toast.success(`Image Sent!`, {
              position: "top-right",
              autoClose: 3000
            });
          } else {
            toast.done(toastId);
          }
        } catch (error) {
          toast.error(error)
        }
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (text.trim() !== "") {
      // addMessage(text, true);
      try {
        const { error } = await supabase.from('messages').insert([{
          chat_id: parseInt(chatId),
          author_id: currentUser.id,
          content: text.trim(),
          from_lang: localStorage.getItem('language')
        }])

        if (error) {
          toast.error(error.message);
          return;
        }
      } catch (error) {
        toast.error(error)
      }
      setText('');
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="container bg-gray-200 mx-auto py-4 p-8">
        <div className="flex flex-row justify-evenly">
          <input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="w-11/12 mb-2 border border-gray-300 rounded-md p-2 outline-none"
            placeholder="Type your message..."
          />
          <div className="flex space-x-2 -my-1">
            {/* <PaperAirplaneIcon className="h-8 w-8 text-blue-500 mx-2" /> */}

            <input
              style={{display: 'none'}}
              className="hidden"
              accept="image/*"
              onChange={event => handleChange(event)}
              ref={hiddenFileInput}
              type="file"
            />
            <button type="button" onClick={() => hiddenFileInput.current.click()}>
              <PhotoIcon className="h-8 w-8 text-primary" />
            </button>
          </div>
        </div>
      </form>
    </>
  );
};

export default MessageInput;
