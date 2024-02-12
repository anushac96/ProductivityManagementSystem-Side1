import axios from "axios";

const authEndpoint = "https://accounts.spotify.com/authorize?";
const clientId = "d9d61a48c75a4468851a097a4e7ef27d";
const redirectUri = "http://localhost:3000";
const scopes = ["user-library-read", "playlist-read-private","user-read-currently-playing","user-read-playback-state"];

export const loginEndpoint = `${authEndpoint}client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scopes.join(
  "%20"
)}&response_type=token&show_dialog=true`;

const apiClient = axios.create({
  baseURL: "https://api.spotify.com/v1/me",
});

export const logout = () => {
  window.localStorage.removeItem("token")
}

export const setClientToken = (token) => {
  //console.log("inside setClientToken:",token);
  
  // apiClient.interceptors.request.use(async function (config) {
  //   config.headers.Authorization = "Bearer " + token;
  //   console.log("return");
  //   return config;
  // });
};

export default apiClient;