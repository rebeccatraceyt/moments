import axios from "axios";

// define the baseURL (unique url for deployed API)
axios.defaults.baseURL = 'https://rtt-drf-api.onrender.com';

// set the data format to the format the API will be expecting
// multipart is needed because the app will deal with images and text in requests
axios.defaults.headers.post['Content-Type'] = 'multipart/form-data';

// setting to true avoids any CORS errors when sending cookies
// needs to be set to send cookies when API and Frontend are on different domains
axios.defaults.withCredentials = true;

//Need axios interceptors to intercept both requests and responses from the API - avoid auto-logout
// 1. Response interceptor 
//      - listens for when the API responds that the user's access token has expired
//      - refreshes that token in the background - keeping user logged in for 24 hours    
export const axiosRes = axios.create();

// 2. Request interceptor
//      - automatically intercept any request the application sends to the the API that requires info about logged in user
//      - refreshes the user's access token before sending the request to the API
//      - this means users can keep liking posts or following profiles
//      - If user is logged in, but token is expired in the background, request fetches the data and refreshes the token in the background
export const axiosReq = axios.create();