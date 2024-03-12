import { memo, useLayoutEffect, useRef, useState } from "react";
import * as sdk from 'microsoft-cognitiveservices-speech-sdk';
const SPEECH_KEY = import.meta.env.VITE_SPEECH_KEY;
const SPEECH_REGION = import.meta.env.VITE_SPEECH_REGION;
import wav from 'audiobuffer-to-wav';
import { toast } from "react-toastify";


const AudioFromFile = memo(({sourceLang, targetLang}) => {
  const [transcript, setTranscript] = useState('');
  const [loader, setLoader] = useState(false);
  const speechConfig = sdk.SpeechTranslationConfig.fromSubscription(
    SPEECH_KEY,
    SPEECH_REGION
  );
  speechConfig.speechRecognitionLanguage = sourceLang;
  speechConfig.addTargetLanguage(targetLang)
  speechConfig.setProfanity(sdk.ProfanityOption.Raw);
  speechConfig.enableDictation();

  const recogTextArea = useRef(null)
  const autoHeight = useRef();


  const initAudioTranslate = (selectedFile) => {
    try {
      const audioConfig = sdk.AudioConfig.fromWavFileInput(selectedFile);      
    
      const recognizer = new sdk.TranslationRecognizer(
        speechConfig,
        audioConfig
      );

      // recognizer.recognizing = (s, e) => {
      //   console.log(e.result.text);
      // }

       recognizer.recognizeOnceAsync(result => {
        if (result.reason === sdk.ResultReason.RecognizedSpeech) {
          setTranscript(result.translations.get(targetLang));
          setLoader(false);
        } else {
          toast.error('Error on translating audio: ' + result.errorDetails)
        }
        
        // recognizer.close();
      });
      
    } catch (error) {
      setLoader(false);
      console.log(error);
      toast.error('Error on translating audio: ' + error.message)
    }
      
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

      fileReader.onloadend = (e) => {
        const subByteArray = (new Uint8Array(e.target.result)).subarray(0, 4);
        let fileHeader = '';
        for (let i = 0; i < subByteArray.length; i++) {
          fileHeader += subByteArray[i].toString(16);
        }
        
        setLoader(true);
        if (fileHeader === '52494646') {
          initAudioTranslate(rawFile);
        } else {
          convertToWav(rawFile, (finalData) => {
            initAudioTranslate(finalData);
          });
        }
        
      }
      fileReader.readAsArrayBuffer(rawFile)
    }
  }

  return (<div className="flex flex-row my-3">
    <input type="file" accept="audio/wav, audio/*, video/*" onChange={e => handleFileChange(e)} className="file-input w-[20%] max-w-xs my-2 mr-2" />
    <label className="form-control w-[80%] border-l-2 p-2 border-black">
        <div className="label">
          <span className="label-text">{!loader ? 'Translated' : 'Translating...'}</span>
        </div>
        {!loader ? <textarea className="textarea textarea-bordered"
          readOnly={true}
          ref={recogTextArea}
          defaultValue={transcript}
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