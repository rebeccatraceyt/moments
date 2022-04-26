// custom context  file to store logic for the context ( in order to refactor )

import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import { axiosReq, axiosRes } from '../api/axiosDefaults';
import { useHistory } from 'react-router';
import { removeTokenTimestamp, shouldRefreshToken } from '../utils/utils';

// set global user context || MOVED FROM APP.JS
export const CurrentUserContext = createContext();
export const SetCurrentUserContext = createContext();

// custom hooks to avoid extra (and repeated) imports for useContext
export const useCurrentUser = () => useContext(CurrentUserContext);
export const useSetCurrentUser = () => useContext(SetCurrentUserContext);

export const CurrentUserProvider = ({children}) => {
    // destructure the children prop in place, so to wrap around the children components
    // in return statement's JSX

    // MOVED FROM APP.JS

    // persist the state of the currently logged in user
    const [ currentUser, setCurrentUser ] = useState(null);

    // import history variable hook to redirect users to SignIn page
    const history = useHistory();

    // network request to check who the user is, based on their credentials in the cookie
    // to do that, make a GET request to the user endpoint of the API
    // the network request is made when the component mounts
    const handleMount = async () => {
        try {
            // make a GET request to the user endpoint
            // destructure the data property
            // axiosRes update to the axios instance with response interceptor
            const {data} = await axiosRes.get('dj-rest-auth/user/');
            // set the currentUser to data by calling setCurrentUser with it
            setCurrentUser(data);
        } catch(err){
            // console.log(err);
        }
    };

    useEffect(() => {
        handleMount();
    }, []);

    // useMemo hook usualy used to cache complex values that take time to compute
    // runs before the children components are mounted
    useMemo(() => {
        axiosReq.interceptors.response.use(
            async (config) => {
                // if block will only run if the token should be refreshed
                if (shouldRefreshToken()){
                    // try refresh the token before sending the request
                    try{
                        await axios.post('/dj-rest-auth/token/refresh/');
                    } catch(err){
                        // if that fails, and the user was previously logged in, it mean the refresh token has expired
                        // redirect user to the SignIn page and set currentUser to null
                        setCurrentUser((prevCurrentUser) => {
                            if (prevCurrentUser){
                                history.push('/signin');
                            }
                            return null;
                        });
                        // remove time stamp when needed (when refresh token expires or user logs out)
                        removeTokenTimestamp();
                        return config
                    }
                }
                return config
            },
            (err) => {
                return Promise.reject(err);
            }
        );

        axiosRes.interceptors.response.use(
            // if there is no error, just return the response
            (response) => response,
            async (err) => {
                // if there is an error, check the error status is 401
                if (err.response?.status === 401){
                    // attempt to refresh the token
                    try{
                        await axios.post('/dj-rest-auth/token/refresh/');
                    } catch(err){
                        // If that fails, redirect user to Signin page
                        setCurrentUser((prevCurrentUser) => {
                            if (prevCurrentUser){
                                history.push('/signin');
                            }
                            // set their data to null
                            return null;
                        });
                        // remove time stamp when needed (when refresh token expires or user logs out)
                        removeTokenTimestamp();
                    }
                    // if there is no error refreshing the toke, return axios instance with the error config
                    // to exit the interceptor
                    return axios(err.config);
                }
                // if there wasn't a 401 error, rejext the Promise with the error to exit the interceptor
                return Promise.reject(err);
            }
        );
        // history array needed as a dependency array for the useMemo hook with history inside
        // want useMemo to only run once but the linter will throw a warning if there is an empty dependency array
    }, [history]);

    return (
        <CurrentUserContext.Provider value={currentUser}>
            {/* Provider component allows child component to subscribe to context changes
            It accepts a value prop to be passed to child components that need to consume the value
            In this case: currentUser and setCurrentUser
            This will allow the currentUser value and the function to update it and be available for every child component */}
            <SetCurrentUserContext.Provider value={setCurrentUser}>
                {/* wrap the children components in the prop reference */}
                {children}
            </SetCurrentUserContext.Provider>
        </CurrentUserContext.Provider>
    )
}