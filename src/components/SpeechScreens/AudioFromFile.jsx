import { memo, useLayoutEffect, useRef, useState } from "react";
import { AudioConfig, OutputFormat, ProfanityOption, ResultReason, SpeechTranslationConfig, TranslationRecognizer } from 'microsoft-cognitiveservices-speech-sdk';
const SPEECH_KEY = import.meta.env.VITE_SPEECH_KEY;
const SPEECH_REGION = import.meta.env.VITE_SPEECH_REGION;
import wav from 'audiobuffer-to-wav';
import { toast } from "react-toastify";


const AudioFromFile = memo(({sourceLang, targetLang}) => {
  const [transcript, setTranscript] = useState('');
  const [loader, setLoader] = useState(false);

  const recogTextArea = useRef(null)
  const autoHeight = useRef();


  const initAudioTranslate = (selectedFile) => {
    const speechConfig = SpeechTranslationConfig.fromSubscription(
      SPEECH_KEY,
      SPEECH_REGION
    );
    speechConfig.speechRecognitionLanguage = sourceLang;
    speechConfig.addTargetLanguage(targetLang)
    speechConfig.setProfanity(ProfanityOption.Raw);
    speechConfig.outputFormat = OutputFormat.Detailed;
  
    const audioConfig = AudioConfig.fromWavFileInput(selectedFile);      
    
    const recognizer = new TranslationRecognizer(
      speechConfig,
      audioConfig
    );

     recognizer.recognizeOnceAsync(result => {
      if (result.reason === ResultReason.TranslatedSpeech) {
        setTranscript(result.translations.get(targetLang));
        setLoader(false);
        recognizer.close();

      } else {
        setLoader(false);
        toast.error('Error on translating audio: ' + result.errorDetails)
        recognizer.close();
      }
      
    }, (err) => {
      setLoader(false);
      console.log(err);
      toast.error('Error on detailing audio audio: ' + err)
      recognizer.close();
    });
      
  }

  useLayoutEffect(() => {
    if (!recogTextArea.current) {
      return;
    }

    if (
      autoHeight.current !== undefined &&
      recogTextArea.current.style.height !== autoHeight.current
    ) {
      // don't auto size if the user has manually changed the height
      return;
    }

    recogTextArea.current.style.height = "auto";
    recogTextArea.current.style.overflow = "hidden";
    const next = `${recogTextArea.current.scrollHeight}px`;
    recogTextArea.current.style.height = next;
    autoHeight.current = next;
    recogTextArea.current.style.overflow = "auto";

  }, [transcript, recogTextArea, autoHeight])
  
  /**
   * 
   * @param {import("react").ChangeEvent<HTMLInputElement>} e 
   */
  const handleFileChange = (e) => {
    const rawFile = e.target.files[0];

    if (rawFile) {

      const fileReader = new FileReader();

      fileReader.onloadend = () => {
        // const subByteArray = (new Uint8Array(e.target.result)).subarray(0, 4);
        // let fileHeader = '';
        // for (let i = 0; i < subByteArray.length; i++) {
        //   fileHeader += subByteArray[i].toString(16);
        // }
        
        setLoader(true);
        convertToWav(rawFile, (finalData) => {
          initAudioTranslate(finalData);
        });
        // if (fileHeader === '52494646') {
        //   initAudioTranslate(rawFile);
        // } else {
        //   convertToWav(rawFile, (finalData) => {
        //     initAudioTranslate(finalData);
        //   });
        // }
        
      }
      fileReader.readAsArrayBuffer(rawFile)
    }
  }

  const clearTranslation = () => {
    setTranscript('');
    document.getElementById('file_input').value = null;
  }

  return (<div className="flex flex-row my-3">
    <div className="flex flex-col w-[20%]">
      <input type="file" id="file_input" accept="audio/wav, audio/*, video/*" onChange={e => handleFileChange(e)} className="file-input w-full my-2 mr-2" />
      {transcript && <button className="btn btn-primary btn-outline m-2" onClick={() => clearTranslation()}>Clear</button>}
    </div>
    <label className="form-control w-[80%] border-l-2 p-2 border-black">
        <div className="label">
          <span className="label-text">{!loader ? 'Translated' : 'Translating...'}</span>
        </div>
        {!loader ? <textarea className="textarea textarea-bordered"
          readOnly={true}
          ref={recogTextArea}
          value={transcript}
        /> : <span className="ml-3 loading loading-dots loading-lg"></span>}
    </label>
  </div>
  )
});

AudioFromFile.displayName = 'AudioFromFile';
export default AudioFromFile;

/**
 * 
 * @param {File} rawFile 
 * @param {(File) => Int8Array} cb 
 */
const convertToWav = (rawFile, cb) => {
  const audioContext = new (window.AudioContext)()

  if (rawFile.type.includes('audio')) {
    rawFile.arrayBuffer().then(rawBits => {
      audioContext.decodeAudioData(rawBits, (decodedBuffer) => {
        const wavRawFile = wav(decodedBuffer);
        cb(new Int8Array(wavRawFile))
      })
    })
  } else {
    const numOfChannels = 1;
    const sampleRate =  16000;
    rawFile.arrayBuffer().then(rawBits => {
      audioContext.decodeAudioData(rawBits, (decodedBuffer) => {
        const duration = decodedBuffer.duration;

        const offlineAudioContext = new OfflineAudioContext(numOfChannels, sampleRate * duration, sampleRate);
        const soundSource = offlineAudioContext.createBufferSource();
        const gainNode = offlineAudioContext.createGain();

        // double the volue
        gainNode.gain.value = 2;
        gainNode.connect(offlineAudioContext.destination);

        soundSource.buffer = decodedBuffer;
        soundSource.connect(gainNode)
        soundSource.start();

        offlineAudioContext.startRendering().then(renderedBuffer => {
          const wavRawFile = wav(renderedBuffer);
          cb(new Int8Array(wavRawFile))

          // const blob = new window.Blob([ new DataView(wavRawFile) ], {
          //   type: 'audio/wav'
          // })

          // const anchor = document.createElement('a')
          // document.body.appendChild(anchor)
          // anchor.style = 'display: none'

          // var url = window.URL.createObjectURL(blob)
          // anchor.href = url
          // anchor.download = 'audio_video.wav'
          // anchor.click()
          // window.URL.revokeObjectURL(url)

        }).catch(e => console.error('Error on Rendering ' + e))
      })
    })
  }
  

  
}