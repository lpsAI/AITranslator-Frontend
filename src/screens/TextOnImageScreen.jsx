import { useLayoutEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import { useAppContext } from "../context/AppContext";
import axios from "axios";

const defaultLang = localStorage.getItem('language');

export const TextOnImageScreen = () => {
  const hiddenFileInput = useRef(null);
  const [image, setImage] = useState(null);
  const [origText, setOrigText] = useState('');
  const [imgLng, setImgLang] = useState('');
  const [transText, setTransText] = useState('');
  const {language} = useAppContext()
  const toastId = useRef(null);
  const transTextArea = useRef(null)
  const autoHeight = useRef();

  /**
   * 
   * @param {import("react").ChangeEvent<HTMLInputElement>} e 
   */
  const handleChange = (e) => {
    const file = e.target.files[0]
    if (!file) {
      toast.error("No File Selected!", {
        position: "top-right",
        autoClose: 3000
      });
      return;
    }

    setImage(URL.createObjectURL(file));

    const fd = new FormData();
    fd.append("file", file);
    fd.append('fromLanguage', language ?? localStorage.getItem('language'))

    axios
      .post("https://ai-translator-backend.vercel.app/api/v1/textDetectOnly", fd, {
        onUploadProgress: (progressEvent) => {
          const progress = progressEvent.loaded / progressEvent.total;

          if (toastId.current === null) {
            toastId.current = toast('Text Analyzing', { progress });
          } else {
            toast.update(toastId.current, { progress });
          }
        },
        headers: {
          "Custom-Header": "value",
        },
      }).then((respData) => {
        if (respData && respData.data) {
          
          toast.done(toastId.current);

          if (respData.data.detectedText === '') {
            toast.warn(`No text detected`, {
              position: "top-right",
              autoClose: 3000
            });
            return;
          }
          
          setOrigText(respData.data.detectedText);
          setImgLang(respData.data.detectedLang);

          toast.success(`Text Detected!`, {
            position: "top-right",
            autoClose: 3000
          });

        } else {
          toast.done(toastId.current);
        }
      }).catch(error => {
        toast.done(toastId.current);
        toast.error(`Upload failed: ${error.message}`, {
          position: "top-right",
          autoClose: 3000
        });
        console.error(error);
      })
  }

  const clearText = () => {
    setImage(null);
    setOrigText('');
    setImgLang('');
    setTransText('');
  }

  const translate = async () => {
    if (transText != '') {
      setTransText('');
      return;
    }

    const response = await axios.post("https://ai-translator-backend.vercel.app/api/v1/ai",{
      text: origText, 
      language: language ?? defaultLang, 
      fromLang: imgLng
    } , {
      headers: {'X-Custom-Header': 'foobar'}
    });

    setTransText(response.data.translations[0].text ?? '')
  }

  useLayoutEffect(() => {
    if (!transTextArea.current) {
      return;
    }
    
    
    if (
      autoHeight.current !== undefined &&
      transTextArea.current.style.height !== autoHeight.current
    ) {
      // don't auto size if the user has manually changed the height
      return;
    }

    transTextArea.current.style.height = "auto";

    transTextArea.current.style.overflow = "hidden";

    const nextTwo = `${transTextArea.current.scrollHeight}px`;

    transTextArea.current.style.height = nextTwo

    transTextArea.current.style.overflow = "auto";

  }, [transTextArea, autoHeight, origText]);

  return <div className="container w-screen">
    <div className="flex p-5">
      <div className="w-2/4">
        {image ? <img src={image} alt="pic of uploaded" className="max-w-full w-full h-auto" /> : <h1>No image uploaded</h1>}
      </div>
      <div className="w-2/4 flex flex-col mx-4">
        <div className="w-full">
        <input
            style={{display: 'none'}}
            className="hidden"
            accept="image/*"
            onChange={event => handleChange(event)}
            ref={hiddenFileInput}
            type="file"
          />
          <button className="btn btn-primary p-2 my-4" onClick={() => hiddenFileInput.current.click()}>Upload</button>
          {origText && <>
            <button className="btn btn-primary p-2 mx-4 my-4" onClick={() => translate()}>{transText != '' ? 'Original' : 'Translate'}</button>
            <button className="btn btn-primary p-2 my-4" onClick={() => clearText()}>Clear</button>
          </>}
        </div>
        <div className="w-full">
          <textarea className="textarea textarea-bordered textarea-xl w-full"
            readOnly={true}
            ref={transTextArea}
            defaultValue={transText != '' ? transText : origText}
          />
        </div>
      </div>
    </div>
  </div>
}