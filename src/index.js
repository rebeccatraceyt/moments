import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
// Router imported here to maintain tidiness (wrapping the App component inside)
import { BrowserRouter as Router } from 'react-router-dom';
import { CurrentUserProvider } from './contexts/CurrentUserContext';

ReactDOM.render(
	<React.StrictMode>
		<Router>
			{/* 
				In order for Router to work, the App component needs to be wrapped inside
				This keeps providers tidy and separate from App.js
			*/}
			<CurrentUserProvider>
    			<App />
			</CurrentUserProvider>
		</Router>
    </React.StrictMode>,

	// Refers to the 'root' div in index.html
  	document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
