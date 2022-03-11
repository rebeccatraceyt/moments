import React, { useState } from "react";
import { Link, useHistory } from "react-router-dom";

import styles from "../../styles/SignInUpForm.module.css";
import btnStyles from "../../styles/Button.module.css";
import appStyles from "../../App.module.css";

import { Form, Button, Image, Col, Row, Container, Alert } from "react-bootstrap";
import axios from "axios";

function SignInForm() {
    
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
            await axios.post('/dj-rest-auth/login/', signInData);
            history.push('/');
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