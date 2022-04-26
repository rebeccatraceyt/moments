import React, { useEffect, useRef, useState } from "react";

import styles from "../../styles/PostCreateEditForm.module.css";
import appStyles from "../../App.module.css";
import btnStyles from "../../styles/Button.module.css";

import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Image from "react-bootstrap/Image";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Container from "react-bootstrap/Container";
import Alert from "react-bootstrap/Alert";

import { useHistory } from "react-router-dom";
import { axiosReq } from "../../api/axiosDefaults";
import { useParams } from "react-router-dom";

function PostEditForm() {
	const [errors, setErrors] = useState({});
	const [postData, setPostData] = useState({
		title: '',
		content: '',
		image: ''
	});

	const { title, content, image } = postData;

	// useRef hook declares new imageInput variable
	// gives access to image file on form submit
	const imageInput = useRef(null);

	// history variable to be used to redirect users
	const history = useHistory();

	// fetch data about the post with the id in url
    // access URL parameters with useParams
    // destructured in place with the name of the parameter set in the route (id)
    const {id} = useParams();

	// useEffect hook to handle API request using id parameter
	useEffect(() => {
		const handleMount = async () => {
			try {
				// axiosReq instanct to get post data, passing id into the request string
				// destructure the response into the {data} variable
				const {data} = await axiosReq.get(`/posts/${id}/`);
				const {title, content, image, is_owner} = data;

				// defensive design: check if user is owner to access edit page
				// if so, the postData will be updated with the post data 
				// if not, redirect them to home page
				is_owner ? setPostData({ title, content, image }) : history.push("/");
			} catch (err) {
				// console.log(err);
			}
		};

		handleMount();
	}, [history, id]);

	const handleChange = (event) => {
        setPostData({
            ...postData,
            [event.target.name]: event.target.value,
        });
    };

	const handleChangeImage = (event) => {
		// check if user has chosen a file to upload
		// 	- done by checking if there is a file in the files array
		if (event.target.files.length){
			// in case user changes image file after adding one
			// URL.revokeObjectURL clears browser reference to previous file
			URL.revokeObjectURL(image);

			// call setPostData function
			// spread postData
			setPostData({
				...postData,
				// set the image attribute value and pass it the file in the array
				// URL.createObjectURL creates a local link to the file passed
				// to access the chosen file, access the files array on event.target and choose the first one [0]
				image: URL.createObjectURL(event.target.files[0]),
			});
		}
	};

	const handleSubmit = async (event) => {
		// prevent default form behaviour
		event.preventDefault();
		// instantiate a formData object instance
		const formData = new FormData();

		// append all relevant data to the instance
		formData.append('title', title);
		formData.append('content', content);

		// using the state to display the image preview
		// which means, the file element doesn't contain the image, unless user uploads a new image
		// first need to check if the imageInput element has a file in it, before appending to formData
		if (imageInput?.current?.files[0])
			// if there is no image file, the original file will stay in API
			formData.append('image', imageInput.current.files[0]);

		// because we're sending image file and text, the API will need to refresh 
		// the user's access token before the create post request can be made
		// to do this:
		try {
			// use put() method to add post id and formData to the post endpoint of the API to update post
			// in redirect, id is used to redirect user back to the post just edited
			await axiosReq.put(`/posts/${id}/`, formData);
			history.push(`/posts/${id}`);
		} catch(err){
			// In case of error, log out to console
			// console.log(err);
			if (err.response?.status !== 401){
				// update errors state variable, if not 401
				// user will get redirected thanks to interceptor logic
				setErrors(err.response?.data);
			}
		}
	};

	
	const textFields = (
		<div className="text-center">
			<Form.Group>
				<Form.Label>Title</Form.Label>
				<Form.Control type="text" name="title" value={title} onChange={handleChange} />
			</Form.Group>

			{/* map over the array of errors for each key in the error state
				- use conditional chaining to check if the title key is in the errors object
				- if so, produce Alert */}
			{errors?.title?.map((message, idx) => ( 
				<Alert variant="warning" key={idx}>
					{message}
				</Alert>
			))}

			<Form.Group>
				<Form.Label>Content</Form.Label>
				<Form.Control
					as="textarea"
					rows={6}
					name="content"
					value={content}
					onChange={handleChange}
				/>
			</Form.Group>
			{errors?.content?.map((message, idx) => ( 
				<Alert variant="warning" key={idx}>
					{message}
				</Alert>
			))}


			
			{/* cancel button takes user back to previous page in browser history
			sets arrow function that calls goBack on our history object */}
			<Button
			    className={`${btnStyles.Button} ${btnStyles.Blue}`}
                onClick={() => history.goBack()}
		    >
				cancel
		    </Button>
			
			<Button 
			    className={`${btnStyles.Button} ${btnStyles.Blue}`} 
				type="submit"
			>
				save
			</Button>
		</div>
	);
	
	return (
		<Form onSubmit={handleSubmit}>
			<Row>
				<Col className="py-2 p-0 p-md-2" md={7} lg={8}>
					<Container
					    className={`${appStyles.Content} ${styles.Container} d-flex flex-column justify-content-center`}
          		    >
						<Form.Group className="text-center">
							<figure>
								<Image className={appStyles.Image} src={image} rounded />
							</figure>
							<div>
								<Form.Label
									className={`${btnStyles.Button} ${btnStyles.Blue} btn`} 
									htmlFor="image-upload"
								>
									Change the image
								</Form.Label>
							</div>

							{/* accept prop ensures only images are uploaded */}
							<Form.File 
								id="image-upload"
								accept="image/*"
								onChange={handleChangeImage}
								ref={imageInput}
							/>
						</Form.Group>

						{errors?.image?.map((message, idx) => (
							<Alert variant="warning" key={idx} className="text-center">
								{message}
							</Alert>
						))}

						<div className="d-md-none">{textFields}</div>
					</Container>
				</Col>
				
				<Col md={5} lg={4} className="d-none d-md-block p-0 p-md-2">
					<Container className={appStyles.Content}>{textFields}</Container>
				</Col>
			</Row>
		</Form>
	);
}

export default PostEditForm;
