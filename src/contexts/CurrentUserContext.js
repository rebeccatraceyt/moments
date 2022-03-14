// custom context  file to store logic for the context ( in order to refactor )

import { createContext, useContext, useEffect, useState } from 'react';
import axios from 'axios';

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

    // network request to check who the user is, based on their credentials in the cookie
    // to do that, make a GET request to the user endpoint of the API
    // the network request is made when the component mounts
    const handleMount = async () => {
        try {
            // make a GET request to the user endpoint
            // destructure the data property
            const {data} = await axios.get('dj-rest-auth/user/');
            // set the currentUser to data by calling setCurrentUser with it
            setCurrentUser(data);
        } catch(err){
            console.log(err);
        }
    };

    useEffect(() => {
        handleMount();
    }, []);

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