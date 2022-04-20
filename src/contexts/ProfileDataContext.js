// custom context  file to store logic for the context ( in order to refactor )

import { createContext, useContext, useEffect, useState } from "react";
import { axiosReq } from "../api/axiosDefaults";
import { useCurrentUser } from "./CurrentUserContext";


// set global user context || MOVED FROM APP.JS
export const ProfileDataContext = createContext();
export const SetProfileDataContext = createContext();

// custom hooks to avoid extra (and repeated) imports for useContext
export const useProfileData = () => useContext(ProfileDataContext);
export const useSetProfileData = () => useContext(SetProfileDataContext);

export const ProfileDataProvider = ({children}) => {
    // destructure the children prop in place, so to wrap around the children components
    // in return statement's JSX

    // MOVED FROM PopularProfiles.js

    // store  profiles in the state to be fetched and displayed
    const [profileData, setProfileData] = useState({
        // pageProfile to be used later
        pageProfile: { results: [] },
        popularProfiles: { results: [] },
    });

    const currentUser = useCurrentUser();

    useEffect(() => {
        const handleMount = async () => {
            try {
                // API request to profiles endpoint
                // fetching them in decending order of followers
                const {data} = await axiosReq.get(
                    '/profiles/?ordering=-followers_count'
                );
                // then, call setProfileData function:
                //  - spread previous state
                //  - update only the popular profiles with data from API request
                setProfileData(prevState => ({
                    ...prevState,
                    popularProfiles: data,
                }));
            } catch(err) {
                console.log(err);
            }
        };

        handleMount();

        // re-fetch data depending on state of current user
    }, [currentUser]);

    return (
        <ProfileDataContext.Provider value={profileData}>
            {/* Provider component allows child component to subscribe to context changes
            It accepts a value prop to be passed to child components that need to consume the value
            In this case: currentUser and setCurrentUser
            This will allow the currentUser value and the function to update it and be available for every child component */}
            <SetProfileDataContext.Provider value={setProfileData}>
                {/* wrap the children components in the prop reference */}
                {children}
            </SetProfileDataContext.Provider>
        </ProfileDataContext.Provider>
    )
}