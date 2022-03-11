import React, { useState } from "react";
import { Link, useHistory } from "react-router-dom";

import styles from "../../styles/SignInUpForm.module.css";
import btnStyles from "../../styles/Button.module.css";
import appStyles from "../../App.module.css";

import { Form, Button, Image, Col, Row, Container, Alert } from "react-bootstrap";
import axios from "axios";

const SignUpForm = () => {

    // store the input values using useState hook
    // destructure the useState hook with signUpData and setSignUpData
    // default value will be an object with three properties set to an empty string
    const [signUpData, setSignUpData] = useState({
        username: '',
        password1: '',
        password2: ''
    });

    // destructure signUpDate to avoid using dot notation to access values
    const { username, password1, password2 } = signUpData;

    // call useState hook with an empty object to store all errors
    const [ errors, setErrors ] = useState ({});

    // Call useHistory hook from react-router
    // variable then used to redirect user in handleSubmit
    const history = useHistory();

    // handleChange function will accept an event as a parameter and call setSignUpData function inside
    const handleChange = (event) => {
        // spread setSignUpData so that we only need to update the relevant attribute
        // use JS computed property name which creates a key/value pair with:
            // the key being the input field name
            // the value being the balue entered by the user
        setSignUpData({
            ...signUpData,
            [event.target.name]: event.target.value,
        });
    };

    // handleSubmit funtion to handle form submit
    // async function that accepts the event as an arguement
    const handleSubmit = async (event) => {
        // prevent page refresh
        event.preventDefault();

        // post all signUpDate to the API app endpoint for user registration
        // after successful registration, redirect to signin
        // with ? - the code is called optional chaining
        // check if response is defined before looking for the data
        // if response is not defined, it will throw an error
        try {
            await axios.post('/dj-rest-auth/registration/', signUpData);
            history.push('/signin');
        } catch(err){
            setErrors(err.response?.data);
        }
    };

    return (
        <Row className={styles.Row}>
            <Col className="my-auto py-2 p-md-2" md={6}>
                <Container className={`${appStyles.Content} p-4 `}>
                    <h1 className={styles.Header}>sign up</h1>
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

                        <Form.Group controlId="password1">
                            <Form.Label className="d-none">Password</Form.Label>
                            <Form.Control
                                className={styles.Input}
                                type="password"
                                placeholder="password"
                                name="password1"
                                value={password1}
                                onChange={handleChange}
                            />
                        </Form.Group>
                        
                        {/* password1 blank error message */}
                        {errors.password1?.map((message, idx) =>
                            <Alert variant="warning" key={idx} className="text-center">
                                {message}
                            </Alert>
                        )}

                        <Form.Group controlId="password2">
                            <Form.Label className="d-none">Confirm Password</Form.Label>
                            <Form.Control
                                className={styles.Input}
                                type="password"
                                placeholder="confirm password"
                                name="password2"
                                value={password2}
                                onChange={handleChange}
                            />
                        </Form.Group>

                        {/* password2 blank error message */}
                        {errors.password2?.map((message, idx) =>
                            <Alert variant="warning" key={idx} className="text-center">
                                {message}
                            </Alert>
                        )}

                        <Button className={`${btnStyles.Button} ${btnStyles.Wide} ${btnStyles.Bright}`} type="submit">
                            Sign Up
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
                    <Link className={styles.Link} to="/signin">
                        Already have an account? <span>Sign in</span>
                    </Link>
                </Container>
            </Col>
            <Col
                md={6}
                className={`my-auto d-none d-md-block p-2 ${styles.SignUpCol}`}
            >
                <Image
                className={`${appStyles.FillerImage}`}
                src={
                    "https://codeinstitute.s3.amazonaws.com/AdvancedReact/hero2.jpg"
                }
                />
            </Col>
        </Row>
    );
};

export default SignUpForm;