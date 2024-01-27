import React, { useState, useEffect, useRef } from 'react';

function MediaPlayer() {
  const [state, setState] = useState({
    index: 3,
    currentTime: '0:00',
    musicList: [
      {
        name: 'Heroes Tonight',
        author: 'NSC',
        img: '/imgs/heroes.jpeg',
        audio: '/songs/Janji - Heroes Tonight (feat. Johnning) [NCS Release].mp3',
        duration: '3:28',
      },
      {
        name: 'DEAF KEY-Invincible',
        author: 'NSC',
        img: '/imgs/Invinciple.jpeg',
        audio: '/songs/DEAF KEV - Invincible [NCS Release].mp3',
        duration: '4:33',
      },
      {
        name: 'Heaven',
        author: 'NSC',
        img: '/imgs/heaven.jpeg',
        audio: '/songs/Different Heaven & EH!DE - My Heart [NCS Release].mp3',
        duration: '3:28',
      },
    ],
  });

  const playerRef = useRef(null);
  const timelineRef = useRef(null);
  const playheadRef = useRef(null);
  const hoverPlayheadRef = useRef(null);

  const timeUpdate = () => {
    const duration = playerRef.current.duration;
    const timeLineWidth = timelineRef.current.offsetWidth - playheadRef.current.offsetWidth;
    const playRecent = (100 * playerRef.current.currentTime) / duration;
    playheadRef.current.style.width = playRecent + '%';
    const currentTime = formatTime(playerRef.current.currentTime);

    setState((prev) => ({ ...prev, currentTime }));
  };

  const nextSong = () => {
    const { musicList, index, pause } = state;

    setState((prev) => ({ ...prev, index: (index + 1) % musicList.length }));

    updatePlayer();
    if (pause) {
      playerRef.current.play();
    }
  };

  const resetTimeLine = () => {
    hoverPlayheadRef.current.style.width = '0';
  };

  const hoverTimeLine = (e) => {
    const duration = playerRef.current.duration;
    const playheadWidth = timelineRef.current.offsetWidth;
    const offsetWidth = timelineRef.current.offsetLeft;
    const userClickWidth = e.clientX - offsetWidth;
    const userClickWidthInPresent = (userClickWidth * 100) / playheadWidth;

    if (userClickWidthInPresent <= 100) {
      hoverPlayheadRef.current.style.width = userClickWidthInPresent + '%';
    }
    const time = (duration * userClickWidthInPresent) / 100;

    if (time >= 0 && time <= duration) {
      hoverPlayheadRef.current.dataset.content = formatTime(time);
    }
  };

  const changeCurrentTime = (e) => {
    const duration = playerRef.current.duration;
    const playheadWidth = timelineRef.current.offsetWidth;
    const offsetWidth = timelineRef.current.offsetLeft;
    const userClickWidth = e.clientX - offsetWidth;
    const userClickWidthInPresent = (userClickWidth * 100) / playheadWidth;

    playerRef.current.style.width = userClickWidthInPresent + '%';
    playerRef.current.currentTime = (duration * userClickWidthInPresent) / 100;
  };

  const formatTime = (currentTime) => {
    const minutes = Math.floor(currentTime / 60);
    let seconds = Math.floor(currentTime % 60);

    seconds = seconds >= 10 ? seconds : '0' + seconds;
    const timeFormat = minutes + ':' + seconds;
    return timeFormat;
  };

  const updatePlayer = () => {
    const { musicList, index } = state;
    const currentSong = musicList[index];
    playerRef.current.load();
  };

  const prevSong = () => {
    const { musicList, index, pause } = state;

    setState((prev) => ({
      ...prev,
      index: (index + musicList.length - 1) % musicList.length,
    }));

    updatePlayer();
    if (pause) {
      playerRef.current.play();
    }
  };

  const playOrPause = () => {
    const { musicList, index, pause } = state;
    const currentSong = musicList[index];
    const audio = new Audio(currentSong.audio);

    if (state.pause) {
      playerRef.current.pause();
    } else {
      playerRef.current.play();
    }

    setState((prev) => ({ ...prev, pause: !pause }));
  };

  const clickAudio = (key) => {
    const { pause } = state;

    setState((prev) => ({ ...prev, index: key }));

    updatePlayer();
  };

  useEffect(() => {
    if (playerRef.current) {
      playerRef.current.addEventListener('timeupdate', timeUpdate);
      playerRef.current.addEventListener('ended', nextSong);
    }
  
    if (timelineRef.current) {
      timelineRef.current.addEventListener('click', changeCurrentTime);
      timelineRef.current.addEventListener('mousemove', hoverTimeLine);
      timelineRef.current.addEventListener('mouseout', resetTimeLine);
    }
  
    return () => {
      if (playerRef.current) {
        playerRef.current.removeEventListener('timeupdate', timeUpdate);
        playerRef.current.removeEventListener('ended', nextSong);
      }
  
      if (timelineRef.current) {
        timelineRef.current.removeEventListener('click', changeCurrentTime);
        timelineRef.current.removeEventListener('mousemove', hoverTimeLine);
        timelineRef.current.removeEventListener('mouseout', resetTimeLine);
      }
    };
  }, [state]);

  const { musicList, index, currentTime, pause } = state;
  const currentSong = musicList[index];

  return (
    <div className="card">
      <div className="current-song">
        <audio ref={playerRef}>
          {currentSong && <source src={currentSong.audio} type="audio/ogg" />}
        </audio>
        {currentSong && (
          <>
            <div className="img-wrap">
              <img src={currentSong.img} alt="Song" />
            </div>
            <div className="card">
              <span className="song-name">
                <span className="song-author">{currentSong.author}</span>
                <div className="time">
                  <img className="current-time" alt="Current Time" />
                  <div className="end-time">{currentSong.duration}</div>
                </div>
                <div ref={timelineRef} id="timeline">
                  <div ref={playheadRef} id="playhead" />
                  <div ref={hoverPlayheadRef} id="hover-playhead" data-content="0:00" />
                </div>
                <div className="controls">
                  <button onClick={prevSong} className="prev prev-next current-btn">
                    <i className="fas fa-backward" />
                  </button>
                  <button onClick={playOrPause} className="play current-btn">
                    {!pause ? <i className="fas fa-play" /> : <i className="fas fa-pause" />}
                  </button>
                  <button onClick={nextSong} className="next prev-next current-btn">
                    <i className="fas fa-forward" />
                  </button>
                </div>
              </span>
            </div>
          </>
        )}
        <div className="play-list">
          {musicList.map((music, key = 0) => (
            <div
              key={key}
              onClick={() => clickAudio(key)}
              className={`track ${index === key && !pause ? 'current-audio' : ''}${
                index === key && pause ? 'play-now' : ''
              }`}
            >
              <img className="track-img" src={music.img} alt="Track" />
              <div className="track-discr">
                <span className="track-name">{music.name}</span>
                <span className="track-author">{music.author}</span>
              </div>
              <span className="track-duration">{index === key ? currentTime : music.duration}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );  
}

export default MediaPlayer;