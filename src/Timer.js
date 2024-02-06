import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import PlayButton from './PlayButton';
import PauseButton from './PauseButton';
import SettingButton from './SettingButton';
import { useContext, useState, useEffect, useRef } from 'react';
import SettingsContext from './SettingsContext';
// Import your alarm sound file
import alarmSound from './clock-alarm-8761.mp3';
const red = '#FF0000';
const green = '#00FF00';



function Timer() {
    const settingsInfo = useContext(SettingsContext);
    const [isPaused, setIsPaused] = useState(true);
    const [mode, setMode] = useState('work'); // can be work/break/null
    const [secondsLeft, setSecondsLeft] = useState(0);

    const secondsLeftRef = useRef(secondsLeft);
    const isPausedRef = useRef(isPaused);
    const modeRef = useRef(mode);

    // Audio object for playing the alarm sound
    const alarmAudio = new Audio(alarmSound);

    const [totalHoursWorked, setTotalHoursWorked] = useState(getStoredTotalHours());
    const [lastUpdatedDate, setLastUpdatedDate] = useState(getStoredLastUpdatedDate() || new Date().toLocaleDateString());

    const [tags, setTags] = useState(getStoredTags());
    const [selectedTag, setSelectedTag] = useState('');
    const [totalTimeWorked, setTotalTimeWorked] = useState({});
    const [newTag, setNewTag] = useState('');


    function tick() {
        secondsLeftRef.current--;
        setSecondsLeft(secondsLeftRef.current);
    }

    function initTimer() {
        secondsLeftRef.current = settingsInfo.workMinutes * 60;
        setSecondsLeft(secondsLeftRef.current);
    }

    // Function to convert minutes to hh:mm format
    const convertToHoursMinutes = (totalMinutes) => {
        const hours = Math.floor(totalMinutes / 60);
        const minutes = totalMinutes % 60;
        return `${hours}:${minutes < 10 ? '0' + minutes : minutes}`;
    };

    const handleAddTag = () => {
        if (newTag.trim() !== '') {
            setTags(prevTags => [...prevTags, newTag.trim()]);
            setNewTag(''); // Clear the input field after adding the tag
        }
    };

    useEffect(() => {

        initTimer();

        const interval = setInterval(() => {
            if (isPausedRef.current) {
                return;
            }

            if (secondsLeftRef.current === 0) {
                // Update total hours worked when a work cycle completes
                if (modeRef.current === 'work') {
                    const currentDate = new Date().toLocaleDateString();
                    if (currentDate !== lastUpdatedDate) {
                        // Reset the total hours worked at the start of a new day
                        console.log("Reset the total hours worked at the start of a new day");
                        setTotalHoursWorked(0);
                        setLastUpdatedDate(currentDate);
                    } else {
                        // Increment total hours worked by the duration of the work session
                        console.log("Increment total hours worked by the duration of the work session");
                        console.log("settingsInfo.workMinutes / 60:", settingsInfo.workMinutes / 60);
                        setTotalHoursWorked((prevTotal) => {
                            console.log("before prevTotal:", prevTotal);
                            console.log("before prevTotal:", prevTotal.toFixed(2));
                            return prevTotal + settingsInfo.workMinutes;
                        });
                        // setTotalHoursWorked((prevTotal) => {
                        //     console.log("after prevTotal:", prevTotal);
                        //     console.log("after prevTotal:", prevTotal.toFixed(2));
                        // });
                        // const totalMinutesWorked = settingsInfo.workMinutes + parseInt(totalHoursWorked.toString().split(':')[0]) * 60;
                        // const formattedTime = convertToHoursMinutes(totalMinutesWorked);
                        // setTotalHoursWorked(formattedTime);

                        // console.log("totalMinutesWorked: ", totalMinutesWorked);
                        // console.log("formattedTime: ", formattedTime);
                        // setTotalHoursWorked(formattedTime);
                    }
                }
                return switchMode();
            } else {
                // If not completed, just decrement the seconds
                tick();
            }
        }, 1000);
        return () => clearInterval(interval);
    }, [settingsInfo, lastUpdatedDate]);

    const totalSeconds = mode === 'work'
        ? settingsInfo.workMinutes * 60
        : settingsInfo.breakMinutes * 60;
    const percentage = Math.round(secondsLeft / totalSeconds * 100);

    const minutes = Math.floor(secondsLeft / 60);
    let seconds = secondsLeft % 60;
    if (seconds < 10)
        seconds = '0' + seconds;

    // Save tags to local storage when they change
    useEffect(() => {
        localStorage.setItem('tags', JSON.stringify(tags));
    }, [tags]);

    // Store total hours worked and last updated date in localStorage
    useEffect(() => {
        localStorage.setItem('totalHoursWorked', totalHoursWorked);
        localStorage.setItem('lastUpdatedDate', lastUpdatedDate);
    }, [totalHoursWorked, lastUpdatedDate]);

    // Load tags from local storage on component mount
    useEffect(() => {
        const storedTags = JSON.parse(localStorage.getItem('tags')) || [];
        setTags(storedTags);
    }, []);

    // Load total time worked data from local storage on component mount
    useEffect(() => {
        const storedTotalTimeWorked = JSON.parse(localStorage.getItem('totalTimeWorked')) || {};
        setTotalTimeWorked(storedTotalTimeWorked);
    }, []);

    // Update the total time worked for the selected tag during work sessions
    useEffect(() => {
        const timerId = setInterval(() => {
            if (!isPaused && mode === 'work') { // Only increment during work sessions
                setTotalTimeWorked(prev => ({
                    ...prev,
                    [selectedTag]: (prev[selectedTag] || 0) + 1
                }));
            }
        }, 1000);
        return () => clearInterval(timerId);
    }, [isPaused, mode, selectedTag]);

    // Handle tag selection
    const handleTagChange = (event) => {
        setSelectedTag(event.target.value);
    };

    function getStoredTotalHours() {
        return parseFloat(localStorage.getItem('totalHoursWorked')) || 0;
    }

    function getStoredLastUpdatedDate() {
        return localStorage.getItem('lastUpdatedDate') || '';
    }

    function getStoredTags() {
        return JSON.parse(localStorage.getItem('tags')) || [];
    }

    function switchMode() {
        const nextMode = modeRef.current === 'work' ? 'break' : 'work';
        const nextSeconds = (nextMode === 'work' ? settingsInfo.workMinutes : settingsInfo.breakMinutes) * 60

        setMode(nextMode);
        modeRef.current = nextMode;

        setSecondsLeft(nextSeconds);
        secondsLeftRef.current = nextSeconds;

        // Play the alarm sound when the timer switches mode
        alarmAudio.play();
    }
    return (
        <div>
            <div>
                <select value={selectedTag} onChange={handleTagChange}>
                    <option value="">Select Tag</option>
                    {tags.map(tag => (
                        <option key={tag} value={tag}>{tag}</option>
                    ))}
                </select>
                <input
                    type="text"
                    placeholder="Add new tag"
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                />
                <button onClick={handleAddTag}>Add</button>
            </div>
            <CircularProgressbar
                value={percentage}
                text={minutes + ' : ' + seconds}
                styles={buildStyles({
                    textColor: '#fff',
                    pathColor: mode === 'work' ? red : green,
                    tailColor: 'rgba(255,255,255,.2)',
                })} />
            <div stype={{ marginTop: '20px' }}>
                {isPaused
                    ? <PlayButton onClick={() => { setIsPaused(false); isPausedRef.current = false; }} />
                    : <PauseButton onClick={() => { setIsPaused(true); isPausedRef.current = true; }} />}
            </div>
            <div>
                <div stype={{ marginTop: '20px' }}>
                    <SettingButton onClick={() => settingsInfo.setShowSettings(true)} />
                </div>
            </div>
            <div style={{ marginTop: '20px' }}>
                <p>Total Minutes Worked Today: {totalHoursWorked}</p>
            </div>
        </div>
    );
}

export default Timer;