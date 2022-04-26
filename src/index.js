import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
// Router imported here to maintain tidiness (wrapping the App component inside)
import { BrowserRouter as Router } from 'react-router-dom';
import { CurrentUserProvider } from './contexts/CurrentUserContext';
import { ProfileDataProvider } from './contexts/ProfileDataContext';

ReactDOM.render(
	// React.StrictMode highlights potential problems in an application by running additional checks and warnings
	// it is only for development purposes and is removed for final deployment
	// <React.StrictMode>
		<Router>
			{/* 
				In order for Router to work, the App component needs to be wrapped inside
				This keeps providers tidy and separate from App.js
			*/}
			<CurrentUserProvider>
				<ProfileDataProvider>
    				<App />
				</ProfileDataProvider>
			</CurrentUserProvider>
		</Router>,
    // </React.StrictMode>,

	// Refers to the 'root' div in index.html
  	document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
