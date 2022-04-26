import axios from "axios";
import { useEffect } from "react";
import { useHistory } from "react-router-dom"

export const useRedirect = (userAuthStatus) => {
    // userAuthStatus arguement will be a string set to either 'loggedIn' or 'loggedOut'
    // this depends on which type of user is to be redirected
    
    // programmatically redirect users back to the home page
    const history = useHistory();

    // tell whether the user is logged in, make network request on mount
    useEffect(() => {
        const handleMount = async () => {
            try {
                // post request to dj-rest-auth/token/refresh endpount with axios instance
                await axios.post('/dj-rest-auth/token/refresh/')
                // if user is logged in, code below will run
                // check userAuthStatus
                if (userAuthStatus === 'loggedIn'){
                    history.push('/');
                }

            } catch(err) {
                // if user is not logged in (API request throws error), code below will run
                if (userAuthStatus === 'loggedOut'){
                    history.push('/');
                }
            }
        }

        handleMount();
    }, [history, userAuthStatus]);
}