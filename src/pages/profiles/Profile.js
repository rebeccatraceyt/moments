import React from "react";
import styles from "../../styles/Profile.module.css"
import btnStyles from "../../styles/Button.module.css"
import { useCurrentUser } from "../../contexts/CurrentUserContext";
import Avatar from "../../components/Avatar";
import { Link } from "react-router-dom";
import { Button } from "react-bootstrap";
import { useSetProfileData } from "../../contexts/ProfileDataContext";

const Profile = (props) => {
    // destructure profile props
    const {profile, mobile, imageSize=55} = props;

    // access data within profile object
    const {id, following_id, image, owner} = profile;

    // access current user context
    const currentUser = useCurrentUser();

    // check if username matches profile owner
    const is_owner = currentUser?.username === owner;

    // access setProfileData hook to destructure handleFollow function
    const { handleFollow, handleUnfollow } = useSetProfileData();

    return (
        <div
            className={`my-3 d-flex align-items=center ${mobile && "flex-column"}`} 
        >
            <div>
                <Link className="align-self-center" to={`/profiles/${id}`}>
                    <Avatar src={image} height={imageSize} />
                </Link>
            </div>
            <div className={`mx-2 ${styles.WordBreak}`}>
                <strong>{owner}</strong>
            </div>

            {/* following buttons */}
            <div className={`text-right ${!mobile && 'ml-auto'}`}>
                {!mobile && currentUser && !is_owner && (
                    // if user has followed profile, following_id prop won't be null and can be used in ternary
                    following_id ? (
                        <Button
                            className={`${btnStyles.Button} ${btnStyles.BlackOutline}`}
                            onClick={() => handleUnfollow(profile)}
                        >
                            unfollow
                        </Button>
                    ) : (
                        <Button 
                            className={`${btnStyles.Button} ${btnStyles.Black}`}
                            onClick={() => handleFollow(profile)}
                        >
                            follow
                        </Button>
                    )
                )}
            </div>
        </div>
    );
};

export default Profile;
