import React, { useEffect } from "react";
import { useRef } from "react";
import { generate, count } from "random-words";
import { useState } from "react";
import "./App.css";
const NUM_OF_Words = 200;
const SEC = 60;

function App() {
  const [timer, setTimer] = useState(60);
  const [words, setwords] = useState([]);
  const [currInput, setcurrInput] = useState("");
  const [currWordidx, setcurrWordidx] = useState(0);
  const [currcharidx, setcurrcharidx] = useState(-1);
  const [currchar, setcurrchar] = useState("");
  const [correct, setcorrect] = useState(0);
  const [incorrect, setincorrect] = useState(0);
  const [wordCount, setwordCount] = useState(0);
  const [stats, setstats] = useState("waiting");
  const textinput = useRef(null);
  const [startTime, setStartTime] = useState(null);
const [endTime, setEndTime] = useState(null);
const [correctWords, setCorrectWords] = useState(0);
const [correctChars, setCorrectChars] = useState(0);

  useEffect(()=>{
    setwords(generateRandomWords())
  },[])

  useEffect(()=>{
    if(stats==='started')
    {
      textinput.current.focus();
    }
  },[stats])

  const generateRandomWords = () =>{
        return new Array(NUM_OF_Words).fill(null).map(()=>generate());
  }

  const start = () =>{
    if(stats==='finished')
    {
      setCorrectWords(0);
      setCorrectChars(0);
      setwords(generateRandomWords());
      setcurrWordidx(0);
      setcorrect(0);
      setincorrect(0);
      setcurrcharidx(-1);
      setcurrchar("");
      setwordCount(0);
    }
    if(stats!=='started')
    {
        setstats('started')
        setStartTime(new Date());
        setTimer(60)
        const interval = setInterval(() =>{
          setTimer(previousTime =>
          {if(previousTime==0)
          {
            setstats("finished")
            setEndTime(new Date());
            setcurrInput("")
            clearInterval(interval)
            return 0;
          }
          else{
            return previousTime-1
          }});
        },1000)
      }
    }

  const handlekeyPress = (e) =>{
      if(e.keyCode===32)
      {
        console.log(currInput);
        checkMatch();
        setcurrInput("");
        setcurrWordidx(currWordidx+1);
        setwordCount(wordCount+1);
        setcurrcharidx(-1);;
      }
      else if(e.keyCode=== 8)
      {
          setcurrcharidx(currcharidx-1);
          setcurrchar("");
      }
      else
      {
        setcurrcharidx(currcharidx+1);
        setcurrchar(e.key)
      }

  }

  const checkMatch = () =>{
    const wordtocomp = words[currWordidx];
    const doesitmatch = wordtocomp === currInput.trim()
    if(doesitmatch)
    {
      setcorrect(correct+1);
      setCorrectWords(correctWords + 1);
      setCorrectChars(correctChars + wordtocomp.length);
    }
    else
    {
      setincorrect(incorrect+1);
    }
    console.log("correct" ,correct)
    console.log("incorrect",incorrect)
  }

  const getcharclass = (wordidx, charidx, char) =>{
      if(wordidx===currWordidx && charidx===currcharidx &&  currchar && stats!== 'finished')
      {
        if(char === currchar)
        {
          return "green-text";
        }
        else 
        {
          return "red-text";
        }
      }  
      else
      {
        return "";
      }
  }

  const calculateAccuracy = () => {
    return correctWords + incorrect!==0 ? Math.floor((correctWords / (correctWords + incorrect)) * 100) : 0;
  }
  
  const calculateWPM = () => {
    return Math.floor((correctWords / ((endTime - startTime) / 1000)) * 60);
  }
  
  const calculateCPM = () => {
    return Math.floor((correctChars / ((endTime - startTime) / 1000)) * 60);
  }
  

  return (
    <div className="app">
      <h1 className="title">
        <b>Typing Text</b>
      </h1>
      <h2 className="heading">
        <b>Test Your Typing Skills...</b>
      </h2>
      <div className="timer">
        <b>{timer}</b>
      </div>
      {stats==='started' && (
      <div className="paragraph-container" >
        <p className="paragraph-box">
            {words.map( (word,i) => (
                  <span key={i} >
                    {word.split("").map((char,idx)=>(
                      <span key={idx} className={getcharclass(i, idx, char)}>{char}</span>
                    ))}
                  <span> </span>
                  </span>
            ))}  
          </p> 
      </div>
        ) }
      <div className="input-tab input-group mb-3">
        <input
          type="text"
          className="form-control"
          aria-label="Sizing example input"
          aria-describedby="inputGroup-sizing-default"
          onKeyDown={handlekeyPress}
          value={currInput}
          disabled={stats!=='started'}
          onChange={(e)=>setcurrInput(e.target.value)}
          ref={textinput}
        />
        
      </div>
        <button type="button" className="btn btn-success" onClick={start}>Start Test</button>
       {stats==='finished' && (
        <div className="item">
          <div className="item1">
            <h1 className="tag">{calculateAccuracy()}%</h1>
            <h2>Accuracy</h2>
          </div>
          <div className="item2">
            <h1 className="tag" >{calculateWPM()}</h1>
            <h3><b>WPM</b></h3>
          </div>
          <div className="item3">
            <h1 className="tag">{calculateCPM()}</h1>
            <h3><b>CPM</b></h3>
          </div>
        </div>
       )}
    </div>
  );
}

export default App;
