import React, { useEffect, useState } from "react";

import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Container from "react-bootstrap/Container";

import appStyles from "../../App.module.css";
import { useParams } from "react-router-dom";
import { axiosReq } from "../../api/axiosDefaults";
import Post from "./Post";
import { useCurrentUser } from "../../contexts/CurrentUserContext";
import CommentCreateForm from "../comments/CommentCreateForm";
import Comment from "../comments/Comment";
import InfiniteScroll from "react-infinite-scroll-component";
import Asset from "../../components/Asset";
import { fetchMoreData } from "../../utils/utils";
import PopularProfiles from "../profiles/PopularProfiles";

function PostPage() {
    
    // fetch data about the post with the id in url
    // access URL parameters with useParams
    // destructured in place with the name of the parameter set in the route (id)
    const {id} = useParams();

    // store the post id in the state
    // when reaching out with a single object, API returns single object
    // when reaching out with multiple objects, API returns an array
    // for compatibility with arrays (making it easier to deal with multiple data types):
    //  - set initial value of the state to an object that contains an empty array of results
    //  - which means, we can always operate on the results array, regardless of the number objects we request from API
    const [post, setPost] = useState({ results: [] });

    const currentUser = useCurrentUser();
    const profile_image = currentUser?.profile_image;
    const [comments, setComments] = useState({ results: [] });

    useEffect(() => {
        // fetch the post on mount
        const handleMount = async () => {
            try {
                // destructuring and renaming data property returned from API to post, in place
                // allows you to give variable a more meaningful name
                // Promise.all accepts an array of promises and gets resovled when all promises get resolved
                // this returns the array of data
                // If any promises in the array were to fail, Promise.all will be rejected, with an error
                const [{data: post}, {data: comments}] = await Promise.all([
                    // request to API to return specific post
                    axiosReq.get(`/posts/${id}`),

                    // request to API to return comments for specific post
                    axiosReq.get(`/comments/?post=${id}`)
                ]);

                // setPost function updates results array, in the state, to contain that post
                setPost({results: [post]});
                // setComments to update state and display comments
                setComments(comments);
            } catch(err){
                console.log(err);
            }
        }

        // call function
        handleMount();
        // id array makes sure the code is run every time the post id in the url changes
    }, [id]);

    return (
        <Row className="h-100">
            <Col className="py-2 p-0 p-lg-2" lg={8}>
                <PopularProfiles mobile />
                {/* spread post object from the results array so that its key value pairs are passed as props
                    pass prop from PostPage - without a values means that it will be returned as true inside Post component */}
                <Post {...post.results[0]} setPosts={setPost} postPage />
                <Container className={appStyles.Content}>
                    {
                        currentUser ? (
                            <CommentCreateForm
                                profile_id={currentUser.profile_id}
                                profileImage={profile_image}
                                post={id}
                                setPost={setPost}
                                setComments={setComments}
                            />
                        ) : comments.results.length ? (
                            "Comments"
                        ) : null
                    }

                    {/* check if there are any comments in the array (post has comments to display) 
                        if so, map over the coments.
                        if not, check if the currentUser is logged in
                            - if so, display enocouragement to comment
                            - if not, display 'no comments' message
                    */}
                    {
                        comments.results.length ? (
                            <InfiniteScroll 
                                children={comments.results.map((comment) => (
                                    <Comment
                                        key={comment.id}
                                        {...comment}
                                        setPost={setPost}
                                        setComments={setComments}
                                    />
                                ))}
                                dataLength={comments.results.length}
                                loader={<Asset spinner />}
                                hasMore={!!comments.next}
                                next={() => fetchMoreData(comments, setComments)}
                            />
                        ) : currentUser ? (
                            <span>
                                No comments yet, be the first one!
                            </span>
                        ) : (
                            <span>
                                No comments... yet
                            </span>
                        )
                    }
                </Container>
            </Col>
            <Col lg={4} className="d-none d-lg-block p-0 p-lg-2">
                <PopularProfiles />
            </Col>
        </Row>
    );
}

export default PostPage;
