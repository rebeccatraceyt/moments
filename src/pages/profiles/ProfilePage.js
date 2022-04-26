import React, { useEffect, useState } from "react";

import { Col, Row, Image, Container, Button } from "react-bootstrap";

import Asset from "../../components/Asset";

import styles from "../../styles/ProfilePage.module.css";
import appStyles from "../../App.module.css";
import btnStyles from "../../styles/Button.module.css";
import NoResults from "../../assets/no-results.png";

import PopularProfiles from "./PopularProfiles";
import { useCurrentUser } from "../../contexts/CurrentUserContext";
import { useParams } from "react-router-dom";
import { axiosReq } from "../../api/axiosDefaults";
import { useProfileData, useSetProfileData } from "../../contexts/ProfileDataContext";
import InfiniteScroll from "react-infinite-scroll-component";
import Post from "../posts/Post";
import { fetchMoreData } from "../../utils";

function ProfilePage() {
    const [hasLoaded, setHasLoaded] = useState(false);

    // set initial state of profile owner's posts array (empty)
    const [profilePosts, setProfilePosts] = useState({ results: [] });

    // import current user context
    const currentUser = useCurrentUser();

    // extract id from the url with useParams to fetch profile
    const {id} = useParams();

    // import profile data context to fetch data
    // with returning multiple functions within an object, destructure the data in place of the hook
    const {setProfileData, handleFollow, handleUnfollow} = useSetProfileData();

    // import ProfileData hook to access pageProfile data
    const {pageProfile} = useProfileData();

    // destructure single profile object from results array
    const [profile] = pageProfile.results;

    // check if logged in user is profile owner
    const is_owner = currentUser?.username === profile?.owner;

    useEffect(() => {
        // fetch user profile data
        const fetchData = async () => {
            try {
                // destructure the data returned and remane it to pageProfile
                // Promise.all accepts the array of promises and gets resovled when all promises get resolved
                //      promising to fetch the user profile and their posts
                const [{data: pageProfile}, {data: profilePosts}] = await Promise.all([
                    axiosReq.get(`/profiles/${id}/`),
                    axiosReq.get(`/posts/?owner__profile=${id}`),
                ]);
                // call profile data context and spread prevState, updating the pageProfile data only
                setProfileData(prevState => ({
                    ...prevState,
                    pageProfile: {results: [pageProfile]},
                }));

                // call profile posts
                setProfilePosts(profilePosts);

                // after pageProfile data has been fetched and updated the state, hide the loader
                setHasLoaded(true);
            } catch(err) {
                console.log(err);
            }
        };

        fetchData();
    }, [id, setProfileData]);

    const mainProfile = (
        <>
            <Row noGutters className="px-3 text-center">
                <Col lg={3} className="text-lg-left">
                    <Image
                        className={styles.ProfileImage}
                        roundedCircle src={profile?.image}
                    />
                </Col>
                <Col lg={6}>
                    <h3 className="m-2">{profile?.owner}</h3>
                    <Row className="justify-content-center no-gutters">
                        <Col xs={3} className="my-2">
                            <div>{profile?.posts_count}</div>
                            <div>posts</div>
                        </Col>
                        <Col xs={3} className="my-2">
                            <div>{profile?.followers_count}</div>
                            <div>followers</div>
                        </Col>
                        <Col xs={3} className="my-2">
                            <div>{profile?.following_count}</div>
                            <div>following</div>
                        </Col>
                    </Row>
                </Col>
                <Col lg={3} className="text-lg-right">
                    {currentUser && !is_owner && (
                        // if user has followed profile, following_id prop won't be null and can be used in ternary
                        profile?.following_id ? (
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
                </Col>
                { profile?.content && (<Col className="p-3">{profile?.content}</Col>) }
            </Row>
        </>
    );

    const mainProfilePosts = (
        <>
            <hr />
            <p className="text-center">{profile?.owner}'s posts</p>
            <hr />
            {profilePosts.results.length ? (
                <InfiniteScroll
                    children={profilePosts.results.map((post) => (
                        <Post key={post.id} {...post} setPosts={setProfilePosts} />
                    ))}
                    dataLength={profilePosts.results.length}
                    loader={<Asset spinner />}
                    hasMore={!!profilePosts.next}
                    next={() => fetchMoreData(profilePosts, setProfilePosts)}
                />
            ) : (
                // show no results asset
                <Container className={appStyles.Content}>
                    <Asset src={NoResults} message={`No results found, ${profile?.owner} hasn't posted yet.`} />
                </Container>
            )}
        </>
    );

    return (
        <Row>
            <Col className="py-2 p-0 p-lg-2" lg={8}>
                <PopularProfiles mobile />
                <Container className={appStyles.Content}>
                    {hasLoaded ? (
                        <>
                            {mainProfile}
                            {mainProfilePosts}
                        </>
                    ) : (
                        <Asset spinner />
                    )}
                </Container>
            </Col>
            <Col lg={4} className="d-none d-lg-block p-0 p-lg-2">
                <PopularProfiles />
            </Col>
        </Row>
    );
}

export default ProfilePage;
