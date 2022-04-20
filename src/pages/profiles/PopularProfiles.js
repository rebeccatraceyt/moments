import React, { useEffect, useState } from "react";
import { Container } from "react-bootstrap";
import { axiosReq } from "../../api/axiosDefaults";
import appStyles from "../../App.module.css"
import Asset from "../../components/Asset";
import { useCurrentUser } from "../../contexts/CurrentUserContext";

const PopularProfiles = ( { mobile }) => {
    // store most followed profiles in the state to be fetched and displayed
    const [profileData, setProfileData] = useState({
        // pageProfile to be used later
        pageProfile: { results: [] },
        popularProfiles: { results: [] },
    });

    const { popularProfiles } = profileData;
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
        <Container
            className={`${appStyles.Content} ${
                mobile && 'd-lg-none text-center mb-3'
            }`}>
            {popularProfiles.results.length ? (
                <>
                    <p>Most followed profiles:</p>
                    {mobile ? (
                        <div className="d-flex justify-content-around">
                            {/* map over popularProfiles results:
                                - for each profile, display paragraph */}
                            {popularProfiles.results.slice(0,4).map(profile => (
                                <p key={profile.id}>{profile.owner}</p>
                            ))}
                        </div>
                    ) : (
                        /* map over popularProfiles results:
                            - for each profile, display paragraph */
                        popularProfiles.results.map(profile => (
                            <p key={profile.id}>{profile.owner}</p>
                        ))
                    )}
                </>
            ) : (
                // show loading spinner
                <Asset spinner />
            )}
        </Container>
    );
};

export default PopularProfiles;
