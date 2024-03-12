import { memo, useEffect, useLayoutEffect, useRef, useState } from "react";
import * as sdk from 'microsoft-cognitiveservices-speech-sdk';

const SPEECH_KEY = import.meta.env.VITE_SPEECH_KEY;
const SPEECH_REGION = import.meta.env.VITE_SPEECH_REGION;

const AudioFromMic = memo(({sourceLang, targetLang}) => {
  const [isListening, setIsListening] = useState(false);
  const [myTranscript, setMyTranscript] = useState([]);
  const [recognizingTranscript, setRecTranscript] = useState([]);
  const recognizerRef = useRef(null);
  const recogTextArea = useRef(null)
  const transTextArea = useRef(null)
  const autoHeight = useRef();
  const speechConfig = sdk.SpeechTranslationConfig.fromSubscription(
    SPEECH_KEY,
    SPEECH_REGION
  );

  const audioConfig = sdk.AudioConfig.fromDefaultMicrophoneInput();

  speechConfig.speechRecognitionLanguage = sourceLang;
  speechConfig.addTargetLanguage(targetLang)
  speechConfig.setProfanity(sdk.ProfanityOption.Raw);
  speechConfig.enableDictation();

    /**
   * 
   * @param {sdk.TranslationRecognitionEventArgs} event 
   */
  const processRecognizedTranscript = (event) => {
    const result = event.result;    
    if (result.reason === sdk.ResultReason.TranslatedSpeech) {
       const transcript = result.translations.get(targetLang);
      setMyTranscript(oldVals => [...oldVals, transcript]);

      // console.log('Transcript: -->', myTranscript);
    }
    
    // Call a function to process the transcript as needed

  };

  const processRecognizingTranscript = (event) =>{
      const transcript = event.result.text;
      // Call a function to process the transcript as needed

      setRecTranscript(oldVals => [...oldVals, transcript]);
      // if (result.reason === sdk.ResultReason.RecognizingSpeech) {
 
      // }
  }

  useEffect(() => {
    const recognizer = new sdk.TranslationRecognizer(
      speechConfig,
      audioConfig
    );

    recognizer.recognized = (s, e) => processRecognizedTranscript(e);
    recognizer.recognizing = (s, e) => processRecognizingTranscript(e);

    recognizerRef.current = recognizer;

    // recognizer.startContinuousRecognitionAsync(() => {
    //   setIsListening(true);
    // });

    return () => {
      recognizer.stopContinuousRecognitionAsync(() => {
        setIsListening(false);
      });
    }
  }, [sourceLang, targetLang])
  
  const resumeListening = () => {
    if (!isListening) {
      setIsListening(true);
      recognizerRef.current.startContinuousRecognitionAsync(() => {
        console.log('Resumed listening...');
      });
    }  };

  const stopListening = () => {
    setIsListening(false);
    if (recognizerRef.current) {
      recognizerRef.current.stopContinuousRecognitionAsync();
    }
  };

  const clearText = () => {
    setMyTranscript([]);
    setRecTranscript([]);
    setIsListening(false);
    if (recognizerRef.current) {
      recognizerRef.current.stopContinuousRecognitionAsync();
    }
  }

  useLayoutEffect(() => {
    if (!recogTextArea.current || !transTextArea.current) {
      return;
    }
    
    
    if (
      autoHeight.current !== undefined &&
      recogTextArea.current.style.height !== autoHeight.current &&
      transTextArea.current.style.height !== autoHeight.current
    ) {
      // don't auto size if the user has manually changed the height
      return;
    }

    recogTextArea.current.style.height = "auto";
    transTextArea.current.style.height = "auto";

    recogTextArea.current.style.overflow = "hidden";
    transTextArea.current.style.overflow = "hidden";

    const next = `${recogTextArea.current.scrollHeight}px`;
    const nextTwo = `${transTextArea.current.scrollHeight}px`;

    recogTextArea.current.style.height = next;
    transTextArea.current.style.height = nextTwo

    autoHeight.current = next;
    transTextArea.current.style.overflow = "auto";
    recogTextArea.current.style.overflow = "auto";

  }, [recognizingTranscript, myTranscript, recogTextArea, transTextArea, autoHeight]);

  return (<>
    <h1 className="text-xl text-bold text-center my-2"> {isListening ? 'Mic is ON' : 'Mic off'}</h1>
    <div className="flex flex-row my-2 px-2 justify-center">
      <button className="btn mx-2 btn-outline" disabled={isListening} onClick={() => resumeListening()}>{isListening ? 'Listening...' : 'Start Listening'}</button>
      <button className="btn mx-2 btn-outline" disabled={!isListening} onClick={() => stopListening()}>Stop</button>
      <button className="btn mx-2 btn-outline" disabled={!myTranscript.length > 0 || !recognizingTranscript > 0} onClick={() => clearText()}>Clear</button>
    </div>
    <div className="flex flex-row justify-evenly my-3">
      <div className="my-2 p-2 border-base-100 w-1/2">
        <label className="form-control">
          <div className="label">
            <span className="label-text">Incoming</span>
          </div>
          <textarea className="textarea textarea-bordered textarea-lg"
            readOnly={true}
            ref={recogTextArea}
            defaultValue={recognizingTranscript.join('\n')}
          />
        </label>
      </div>
      <div className="my-2 p-2 border-base-100 w-1/2">
        <label className="form-control">
          <div className="label">
            <span className="label-text">Translated</span>
          </div>
          <textarea className="textarea textarea-bordered textarea-lg"
            readOnly={true}
            ref={transTextArea}
            defaultValue={myTranscript.join('\n')}
          />
        </label>
      </div>
    </div>
  </>)
});

AudioFromMic.displayName = 'AudioFromMic';
export default AudioFromMic;