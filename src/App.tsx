import React, { useState } from "react";
import "./App.css";
import { Slider, Button, Typography, Checkbox, FormControlLabel } from "@material-ui/core";

const defaultLenght = 12;

const CheckboxInfos:[keyof MDPOptionsI, string][] = [
  ["incLetters","Include lowercase letters"],
  ["incUpper", "Include uppercase letters"],
  ["incNums", "Include numbers"],
  ["incSpe", "Include special characters"]
];

function App() {
  const [length, setLength] = useState<number>(defaultLenght);
  const [MDPOptions, setMDPOptions] = useState<MDPOptionsI>({
    incNums:true,
    incLetters:true,
    incSpe:true,
    incUpper:true
  });
  const [password, setPassword] = useState<string>(generateMDP(length, MDPOptions));

  const generateNewMDP = (options:MDPOptionsI) => {
    const newPassword = generateMDP(length, options);
    setPassword(newPassword);
  }

  const handleGenerateClick = () => {
    generateNewMDP(MDPOptions);
  }

  const handleCopyClick = () => {
    copyToClipboard(password);
  }

  const handleCheckboxChanges = (name:keyof MDPOptionsI) => () => {
    const newOptions = {...MDPOptions};
    newOptions[name] = !newOptions[name];
    setMDPOptions(newOptions);
    generateNewMDP(newOptions);
  }
  
  const handleSliderChange = (value:number) => {
    if(length !== value) {
      setLength(value);
      generateNewMDP(MDPOptions);
    }
    return value.toString();
  }

  const isDisabled = (name:keyof MDPOptionsI) => {
    if(!MDPOptions[name]) return false;
    const result = CheckboxInfos.reduce<number>((carry, [name]) => MDPOptions[name] ? carry + 1 : carry, 0);
    return result === 1;
  }

  return (
    <div className="App">
      <Typography id="pswrd-length-slider" gutterBottom>
        Choose a password length
      </Typography>
      <Slider
        defaultValue={defaultLenght}
        min={4}
        max={24}
        getAriaValueText={handleSliderChange}
        valueLabelDisplay="auto"
        aria-labelledby="pswrd-length-slider"
      />
      {CheckboxInfos.map(([name, label]) => (
        <FormControlLabel
          key={name}
          control={
            <Checkbox
              disabled={isDisabled(name)}
              name={name}
              checked={MDPOptions[name]}
              onChange={handleCheckboxChanges(name)}
            />
          } 
          label={label}
        />
      ))}
      <Button
        variant="contained"
        onClick={handleGenerateClick}
      >
        Generate
      </Button>
      <div className="password-display">
        <Typography>
          {password}
        </Typography>
      </div>
      <Button
        variant="contained"
        onClick={handleCopyClick}
      >
        Copy
      </Button>
    </div>
  );
};

export default App;

function copyToClipboard(str:string) {
  const el = document.createElement('textarea');
  el.value = str;
  document.body.appendChild(el);
  el.select();
  document.execCommand('copy');
  document.body.removeChild(el);
};

interface MDPOptionsI {
  incNums:boolean,
  incLetters:boolean,
  incUpper:boolean,
  incSpe:boolean
}

// encapsulation of all strings to avoid recomputation
const generateMDP = (() => {
  const nums = Array(10).fill(null).map((_,i) => i.toString()).join("");
  const letters = Array(26).fill(null).map((_,i) => String.fromCharCode("a".charCodeAt(0) + i)).join("");
  const upLetters = letters.split("").map((l) => l.toUpperCase()).join("");
  const speChar = "!\"#$%&'()*+,-./:;<=>?@[\\]^_`{|}~";
  return (lenght:number, options:MDPOptionsI) => {
    const allChar = [];
    if(options.incNums) allChar.push(nums);
    if(options.incLetters) allChar.push(letters);
    if(options.incUpper) allChar.push(upLetters);
    if(options.incSpe) allChar.push(speChar);

    const allCharString = allChar.join("");

    const result:string[] = [];
    while(result.length < lenght) {
      const index = Math.floor(Math.random() * allCharString.length);
      result.push(allCharString[index]);
    }
    return result.join("");
  }
})();