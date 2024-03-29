import React, { useState } from "react";
import { Link, useHistory } from "react-router-dom";
// import { useContext } from "react"; - needed before useSetCurrentUser context import

import styles from "../../styles/SignInUpForm.module.css";
import btnStyles from "../../styles/Button.module.css";
import appStyles from "../../App.module.css";

import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Image from "react-bootstrap/Image";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Container from "react-bootstrap/Container";
import Alert from "react-bootstrap/Alert";

import axios from "axios";
// import { SetCurrentUserContext } from "../../App"; - needed before useSetCurrentUser context import
import { useSetCurrentUser } from "../../contexts/CurrentUserContext";
import { useRedirect } from "../../hooks/useRedirect";
import { setTokenTimestamp } from "../../utils/utils";

function SignInForm() {
    
    // exports access to the setter function from App.js
    // assigns it to a variable to store the user data on sign in
    // const setCurrentUser = useContext(SetCurrentUserContext) - not needed with CurrentUserContext.js

    // import useSetCurrentUser hook from contexts
    const setCurrentUser = useSetCurrentUser();

    // set userAuthStatus from useRedirect hook
    useRedirect('loggedIn');

    const [signInData, setSignInData] = useState({
        username: '',
        password: ''
    });

    const { username, password } = signInData;

    const [ errors, setErrors ] = useState({});

    const history = useHistory();

    const handleChange = (event) => {
        setSignInData({
            ...signInData,
            [event.target.name]: event.target.value,
        });
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            // save the data returned from sign in
            const {data} = await axios.post('/dj-rest-auth/login/', signInData);
            // call it on submit with user data returned from the API
            // setting the current user value to be used
            setCurrentUser(data.user);

            // set time stamp value when user signs into app
            // setTokenTimestamp function is called with returned data object by API, on successful login
            // extracts the expiry data from the access token and saves to user's local storage
            setTokenTimestamp(data);

            // history.push('/');
            // above updated to below to send user back, rather than redirected to home page
            history.goBack();
        } catch (err){
            setErrors(err.response?.data);
        }
    };

    return (
        <Row className={styles.Row}>
            <Col className="my-auto p-0 p-md-2" md={6}>
                <Container className={`${appStyles.Content} p-4 `}>
                    <h1 className={styles.Header}>sign in</h1>
                    <Form onSubmit={handleSubmit}>
                        <Form.Group controlId="username">
                            <Form.Label className="d-none">username</Form.Label>
                            <Form.Control
                                className={styles.Input}
                                type="text"
                                placeholder="username"
                                name="username"
                                value={username}
                                onChange={handleChange}
                            />
                        </Form.Group>
                        
                        {/* map over the array of errors for each key in the error state
                         - use conditional chaining to check if the username key is in the errors object
                         - if so, produce Alert */}
                        {errors.username?.map((message, idx) =>
                            <Alert variant="warning" key={idx} className="text-center">
                                {message}
                            </Alert>
                        )}

                        <Form.Group controlId="password">
                            <Form.Label className="d-none">Password</Form.Label>
                            <Form.Control
                                className={styles.Input}
                                type="password"
                                placeholder="password"
                                name="password"
                                value={password}
                                onChange={handleChange}
                            />
                        </Form.Group>
                        
                        {/* password blank error message */}
                        {errors.password?.map((message, idx) =>
                            <Alert variant="warning" key={idx} className="text-center">
                                {message}
                            </Alert>
                        )}

                        <Button className={`${btnStyles.Button} ${btnStyles.Wide} ${btnStyles.Bright}`} type="submit">
                            Sign In
                        </Button>

                        {/* non_field_errors blank error message */}
                        {errors.non_field_errors?.map((message, idx) =>
                            <Alert variant="warning" key={idx} className={`text-center mt-3`}>
                                {message}
                            </Alert>
                        )}

                    </Form>


                </Container>
                <Container className={`mt-3 ${appStyles.Content}`}>
                    <Link className={styles.Link} to="/signup">
                    Don't have an account? <span>Sign up now!</span>
                    </Link>
                </Container>
            </Col>
            <Col
                md={6}
                className={`my-auto d-none d-md-block p-2 ${styles.SignInCol}`}
            >
                <Image
                    className={`${appStyles.FillerImage}`}
                    src={"https://codeinstitute.s3.amazonaws.com/AdvancedReact/hero.jpg"}
                />
            </Col>
        </Row>
    );
}

export default SignInForm;