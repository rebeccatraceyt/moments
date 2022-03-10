import axios from "axios";

// define the baseURL (unique url for deployed API)
axios.defaults.baseURL = 'https://rebeccatraceyt-drf-api.herokuapp.com/';

// set the data format to the format the API will be expecting
// multipart is needed because the app will deal with images and text in requests
axios.defaults.headers.post['Content-Type'] = 'multipart/form-data';

// setting to true avoids any CORS errors when sending cookies
axios.defaults.withCredentials = true;