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
  //const PLAYLISTS_ENDPOINT = "https://api.spotify.com/v1/me/playlists";
  const [data, setData] = useState({});
  const [playlists, setPlaylists] = useState([]);
  const handleLogin = (loggedIn) => {
    setIsAuthenticated(loggedIn);
  }

  const handleGetPlaylists = () => {
    const playlistId = "6rJxt5sueWxOrKoD5QcGNW"; // Playlist ID for the "Meditation" playlist
    const PLAYLISTS_ENDPOINT = `https://api.spotify.com/v1/playlists/${playlistId}/tracks`;
    const accessToken = localStorage.getItem('token');
    axios
      .get(PLAYLISTS_ENDPOINT, {
        headers: {
          Authorization: "Bearer " + accessToken,
        },
      })
      .then((response) => {
        //const playlists = response.data.items.map(item => item.name);
        //console.log(response.data)
        //console.log("playlist from app.js ",playlists)
        //setPlaylists(playlists);
        // Extract the tracks from the response data
        // Extract the tracks from the response data
        const tracks = response.data.items.map(item => ({
          name: item.track.name,
          author: item.track.artists.map(artist => artist.name).join(', '), // If there are multiple artists
          duration: item.track.duration_ms,
        }));
        console.log(tracks);
        // Update the state with the fetched tracks
        setPlaylists(tracks);
        // Save playlists in local storage to make them persistent
        localStorage.setItem('playlists', tracks);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    // <Login onLogin={handleLogin} handleGetPlaylists={handleGetPlaylists} />
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
      <MediaPlayer handleGetPlaylists={handleGetPlaylists} playlists={playlists}/>
      <Login onLogin={handleLogin} handleGetPlaylists={handleGetPlaylists} setPlaylists={setPlaylists}/>
    </>
  );
}
export default App;