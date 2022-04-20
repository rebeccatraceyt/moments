import React from "react";
import { Container } from "react-bootstrap";
import appStyles from "../../App.module.css"
import Asset from "../../components/Asset";
import { useProfileData } from "../../contexts/ProfileDataContext";
import Profile from "./Profile";

const PopularProfiles = ( { mobile }) => {

    const { popularProfiles } = useProfileData();

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
                                <Profile key={profile.id} profile={profile} mobile />
                            ))}
                        </div>
                    ) : (
                        /* map over popularProfiles results:
                            - for each profile, display paragraph */
                        popularProfiles.results.map(profile => (
                            <Profile key={profile.id} profile={profile} />
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
