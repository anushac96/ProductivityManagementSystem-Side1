import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import PlayButton from './PlayButton';
import PauseButton from './PauseButton';
import SettingButton from './SettingButton';
import { useContext, useState, useEffect, useRef } from 'react';
import SettingsContext from './SettingsContext';

const red =  '#FF0000';
const green = '#00FF00';

function Timer(){
    const settingsInfo = useContext(SettingsContext);
    const [isPaused, setIsPaused] = useState(false);
    const [mode, setMode] = useState('work'); // can be work/break/null
    const [secondsLeft, setSecondsLeft] = useState(0);

    const secondsLeftRef = useRef(secondsLeft);
    const isPausedRef = useRef(isPaused);
    const modeRef = useRef(mode);

    function tick(){
        secondsLeftRef.current--;
        setSecondsLeft(secondsLeftRef.current);
    }

    function initTimer(){
        secondsLeftRef.current = settingsInfo.workMinutes * 60;
        setSecondsLeft(secondsLeftRef.current);
    }
    
    useEffect( () => {
        function switchMode(){
            const nextMode = modeRef.current === 'work' ? 'break' : 'work';
            const nextSeconds = (nextMode ==='work' ? settingsInfo.workMinutes : settingsInfo.breakMinutes) * 60
            
            setMode(nextMode);
            modeRef.current = nextMode;
    
            setSecondsLeft(nextSeconds);
            secondsLeftRef.current = nextSeconds;
        }
        
        initTimer();

        const interval = setInterval(() =>{
            if(isPausedRef.current){
                return;
            }

            if(secondsLeftRef.current === 0){
                return switchMode();
            }

            tick();
        },1000);
        return () =>clearInterval(interval);
    },[settingsInfo]);

    const totalSeconds = mode === 'work'
    ? settingsInfo.workMinutes * 60
    : settingsInfo.breakMinutes * 60;
    const percentage = Math.round(secondsLeft/totalSeconds * 100);

    const minutes = Math.floor(secondsLeft/60);
    let seconds = secondsLeft%60;
    if(seconds<10)  
        seconds = '0'+seconds;

    return (
        <div>
            <CircularProgressbar 
            value={percentage} 
            text={minutes+' : '+seconds} 
            styles={buildStyles({
                textColor:'#fff',
                pathColor:mode === 'work' ? red : green,
                tailColor: 'rgba(255,255,255,.2)',
            })}/>
            <div stype={{marginTop:'20px'}}>
            {isPaused
          ? <PlayButton onClick={() => { setIsPaused(false); isPausedRef.current = false; }} />
          : <PauseButton onClick={() => { setIsPaused(true); isPausedRef.current = true; }} />}
            </div>
            <div>
                <div stype={{marginTop:'20px'}}>
                    <SettingButton onClick={() => settingsInfo.setShowSettings(true)}/>
                </div>
            </div>
        </div>
    );
}

export default Timer;