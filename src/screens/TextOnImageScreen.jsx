import { useLayoutEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import { useAppContext } from "../context/AppContext";
import axios from "axios";
import { Select } from "../components/Select/Select";

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
  const [selectedTargetLang, setSelectedTargetLang] = useState('');

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
    fd.append('fromLanguage', language ?? defaultLang)

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
          
          // toast.done(toastId.current);

          toast.dismiss(toastId.current);

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
          toast.dismiss(toastId.current);
        }
      }).catch(error => {
        toast.dismiss(toastId.current);
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
      language: selectedTargetLang ?? defaultLang, 
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

  const handleTargetSelectedList = (selectedItem) => {
    setSelectedTargetLang(() => selectedItem);
  }

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
            <div className="flex items-end my-4">
              <Select selectedVal={selectedTargetLang} label="Selected Target Language"  key="destination" type="destination" subLabel={selectedTargetLang} onSelcted={handleTargetSelectedList}>
                <option value="">Select a language...</option>
                {JSON.parse(localStorage.getItem('list_languages')).map((lang, key) => (<option key={key} value={lang.langId}>{lang.langName}</option>))}
              </Select>
              <button disabled={selectedTargetLang === ''} className="btn btn-primary p-4 mx-4" onClick={() => translate()}>{transText != '' ? 'Original' : 'Translate'}</button>
              <button className="btn btn-primary p-4" onClick={() => clearText()}>Clear</button>
            </div>
          </>}
        </div>
        <div className="w-full">
            <div className="form-control">
              <textarea className="textarea textarea-bordered textarea-xl w-full"
                readOnly={true}
                ref={transTextArea}
                defaultValue={transText != '' ? transText : origText}/>
            </div>
            <div className="label">
              <span className="label-text-alt">Dectected text: <b>{imgLng}</b></span>
            </div>
        </div>
      </div>
    </div>
  </div>
}