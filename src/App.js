import './App.css';
import Timer from './Timer';
import Settings from './Settings';
import { useState } from 'react';
import SettingsContext from './SettingsContext';
import Calender from './Calender';
import MediaPlayer from './MediaPlayer';
import Register from './Register';
import Login from './login';
import axios from 'axios';

function App() {

  const [showSettings, setShowSettings] = useState(false);
  const [workMinutes, setWorkMinutes] = useState(25);
  const [breakMinutes, setBreakMinutes] = useState(5);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const PLAYLISTS_ENDPOINT = "https://api.spotify.com/v1/me/playlists";
  const [data, setData] = useState({});
  const handleLogin = (loggedIn) => {
    setIsAuthenticated(loggedIn);
  }

  const handleGetPlaylists = () => {
    axios
      .get(PLAYLISTS_ENDPOINT, {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      })
      .then((response) => {
        setData(response.data);
        console.log("Playlists from App.js:", response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <><main>
      <SettingsContext.Provider value={{
        showSettings,
        setShowSettings,
        workMinutes,
        breakMinutes,
        setWorkMinutes,
        setBreakMinutes,
      }}>
        {showSettings ? <Settings /> : <Timer />}
      </SettingsContext.Provider>
    </main>
      <Calender />
      <MediaPlayer />
      <MediaPlayer handleGetPlaylists={handleGetPlaylists}  />
      <Login onLogin={handleLogin} handleGetPlaylists={handleGetPlaylists} />
    </>
  );
}
export default App;