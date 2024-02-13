import React, { useEffect } from "react";
import { loginEndpoint, logout } from "./spotify";
import "./App.css";

export default function Login({ onLogin, handleGetPlaylists }) {
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      onLogin(true);
    }
  }, [onLogin]);

  const handleLogout = () => {
    logout();
    onLogin(false);
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