import React, { useEffect, useState } from "react";

import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Container from "react-bootstrap/Container";

import appStyles from "../../App.module.css";
import { useParams } from "react-router-dom";
import { axiosReq } from "../../api/axiosDefaults";

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
    const [post, setPost] = useState();

    useEffect(() => {
        // fetch the post on mount
        const handleMount = async () => {
            try {
                // destructuring and renaming data property returned from API to post, in place
                // allows you to give variable a more meaningful name
                // Promise.all accepts an array of promises and gets resovled when all promises get resolved
                // this returns the array of data
                // If any promises in the array were to fail, Promise.all will be rejected, with an error
                const [{data: post}] = await Promise.all([
                    axiosReq.get(`/posts/${id}`),
                ]);

                // setPost function updates results array, in the state, to contain that post
                setPost({results: [post]});
                console.log(post);
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
                <p>Popular profiles for mobile</p>
                <p>Post component</p>
                <Container className={appStyles.Content}>Comments</Container>
            </Col>
            <Col lg={4} className="d-none d-lg-block p-0 p-lg-2">
                Popular profiles for desktop
            </Col>
        </Row>
    );
}

export default PostPage;
