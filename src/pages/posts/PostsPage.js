import React, { useEffect, useState } from "react";

import Form from "react-bootstrap/Form";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Container from "react-bootstrap/Container";
import Asset from "../../components/Asset"

import appStyles from "../../App.module.css";
import styles from "../../styles/PostsPage.module.css";
import { useLocation } from "react-router-dom";
import { axiosReq } from "../../api/axiosDefaults";
import Post from "./Post";

import NoResults from "../../assets/no-results.png";
import InfiniteScroll from "react-infinite-scroll-component";
import { fetchMoreData } from "../../utils";
import PopularProfiles from "../profiles/PopularProfiles";

function PostsPage({ message, filter="" }) {
    // state logic to store posts in an object in the results array (which is empty by default)
    const [posts, setPosts] = useState({ results: [] });

    // loading spinner for UX while user waits for post to load
    const [hasLoaded, setHasLoaded] = useState(false);

    // re-fetch posts when user clicks between home,feed and likes
    // to detect this url change, useLocation hook returns an object with data about the current URL
    // this is will detect if the user has flicked between home, feed and liked pages
    const {pathname} = useLocation();

    // handle query value by destructuring the query variable
    const [query, setQuery] = useState("");

    useEffect(() => {
        // API request to fetch posts using filters for each page
        // making sure to only show posts relevant to that filter or show loading icon (if necessary)
        // in the try block:
        //      fetch te posts using the axiosReq instance
        //      the request string will contain our filter parameter set in routes (comes from filter prop)
        //      this will tell the API what to filter (all posts, posts by followed profiles or like posts)
        //      if there is no error, setPost will be the newly fetched data
        //      hasLoaded turns the spinner off
        const fetchPosts = async () => {
            try {
                const {data} = await axiosReq.get(`/posts/?${filter}search=${query}`);
                setPosts(data);
                setHasLoaded(true);
            } catch(err){
                console.log(err);
            }
        };

        // set before posts are fetch so that the spinner will be displayed
        setHasLoaded(false);

        // timeout function means the API request won't be made until one second after final keystroke
        const timer = setTimeout(() => {
            fetchPosts();
        }, 1000);

        // cleanup function to clear timeout so timer is left behind
        return () => {
            clearTimeout(timer);
        }

    }, [filter, query, pathname]);
    // effect is run every time the filter or path name change - inside the dependency array
    
    return (
        <Row className="h-100">
            <Col className="py-2 p-0 p-lg-2" lg={8}>
                <p>Popular profiles mobile</p>
                <i className={`fas fa-search ${styles.SearchIcon}`} />

                {/* prevent default submit behaviour to stop the page refreshing
                    and to make sure the API request is handled by the onChange event and not onSubmit
                */}
                <Form className={styles.SearchBar} 
                    onSubmit={(event) => {
                        event.preventDefault()
                    }}
                >
                    {/* search bar functionality with query dynamically changed by onChange event */}
                    <Form.Control
                        value={query}
                        onChange={(event) => setQuery(event.target.value)}
                        type="text"
                        className="mr-sm-2"
                        placeholder="Search posts"
                    />
                </Form>

                {hasLoaded ? (
                    <>
                        {posts.results.length ? (
                            // Infinite scroll
                            // map over posts and render each one
                            // for each one, return post component, spread post object and pass setPosts function to like/unlike
                            // dataLength prop tells component how many posts are currently displayed
                            // hasMore prop tells InifiniteScroll whether there is more data to load on reaching the bottom of the current page
                            // hasMore only accepts boolean value so double not operator is used
                            //      - the operator returns true for truthy values and false for falsy values
                            //      - if hasMore prop is true, run next prop function
                            // next prop function is in separate utils folder
                            <InfiniteScroll
                                children={posts.results.map(post => (
                                    <Post key={post.id} {...post} setPosts={setPosts} />
                                ))}
                                dataLength={posts.results.length}
                                loader={<Asset spinner />}
                                hasMore={!!posts.next}
                                next={() => fetchMoreData(posts, setPosts)}
                            />

                        ) : (
                            // show no results asset
                            <Container className={appStyles.Content}>
                                <Asset src={NoResults} message={message} />
                            </Container>
                        )}
                    </>
                ) : (
                    // show loading spinner
                    <Container className={appStyles.Content}>
                        <Asset spinner />
                    </Container>
                )}
            </Col>
            <Col md={4} className="d-none d-lg-block p-0 p-lg-2">
                <PopularProfiles />
            </Col>
        </Row>
    );
}

export default PostsPage;