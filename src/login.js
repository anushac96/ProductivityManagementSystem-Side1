import React, { useEffect } from "react";
import { loginEndpoint, logout } from "./spotify";
import "./App.css";

export default function Login({ onLogin, handleGetPlaylists, setPlaylists }) {
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      onLogin(true);
    }
  }, [onLogin]);

  const handleLogout = () => {
    logout();
    onLogin(false);
    // Set the hardcoded music list directly when the user logs out
    setPlaylists([
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
        img: '/imgs/Invinciple.jpeg',
        audio: '/songs/Different Heaven & EH!DE - My Heart [NCS Release].mp3',
        duration: '3:28',
      },
    ]);
  };
  const handleGetPlaylistsClick = () => {
    handleGetPlaylists(); // Call handleGetPlaylists passed from App.js
  };

  return (
    <div>
      {!localStorage.getItem("token") ? (
        <a href={loginEndpoint}>
          <div className="login-btn">LOGIN</div>
        </a>
      ) : (
        <div>
          <button className="playList-btn" onClick={handleGetPlaylistsClick}>
            Get Playlists
          </button>
          <button className="login-btn" onClick={handleLogout}>
            LOGOUT
          </button>
        </div>
      )}
    </div>
  );
}
