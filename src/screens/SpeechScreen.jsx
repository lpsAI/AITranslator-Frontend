import { useState } from 'react';
import { Select } from '../components/Select/Select';
import  AudioFromFile  from '../components/SpeechScreens/AudioFromFile';
import AudioFromMic from '../components/SpeechScreens/AudioFromMic'


export const SpeechScreen = () => {
  const [selectedLang, setSelectedLang] = useState(localStorage.getItem('default_locale'));
  const [selectedTargetLang, setSelectedTargetLang] = useState();
  const [mode, setMode] = useState('mic');

  const handleSelectedList = (selectedItem) => {
    setSelectedLang(() => selectedItem)
  }

  const handleTargetSelectedList = (selectedItem) => {
    setSelectedTargetLang(() => selectedItem);
  }

  const handleMode = (mode) => {
    setMode(() => mode);
  }
  

  return (<div className="w-screen">    
  <div className="w-full h-auto flex flex-row justify-evenly my-5">
    <Select selectedVal={selectedLang} label="Selected Source Language" subLabel={selectedLang} onSelcted={handleSelectedList}>
      {JSON.parse(localStorage.getItem('locale_list')).map((lang, key) => (<option key={key} value={lang.locale}>{lang.label}</option>))}
    </Select>
    <Select selectedVal={selectedTargetLang} label="Selected Target Language"  key="destination" type="destination" subLabel={selectedTargetLang} onSelcted={handleTargetSelectedList}>
      {JSON.parse(localStorage.getItem('list_languages')).map((lang, key) => (<option key={key} value={lang.langId}>{lang.langName}</option>))}
    </Select>
  </div>
  <div className="flex flex-row my-2 px-2 justify-center">
    <button className="btn mx-2 btn-outline" disabled={mode === 'mic'} onClick={() => handleMode('mic')}>From Microphone</button>
    <button className="btn mx-2 btn-outline" disabled={mode === 'file'} onClick={() => handleMode('file')}>From File</button>
  </div>
  {selectedLang && selectedTargetLang && mode === 'mic' && <AudioFromMic key={`mic-${selectedLang}-${selectedTargetLang}`} sourceLang={selectedLang.trim()} targetLang={selectedTargetLang.trim()} />}
  {selectedLang && selectedTargetLang && mode === 'file' && <AudioFromFile key={`file-${selectedLang}-${selectedTargetLang}`}  sourceLang={selectedLang.trim()} targetLang={selectedTargetLang.trim()} />}
</div>);
}