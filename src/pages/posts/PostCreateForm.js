import React, { useRef, useState } from "react";

import Upload from "../../assets/upload.png";

import styles from "../../styles/PostCreateEditForm.module.css";
import appStyles from "../../App.module.css";
import btnStyles from "../../styles/Button.module.css";
import Asset from "../../components/Asset";
import { Alert, Image, Form, Button, Row, Col, Container } from "react-bootstrap";
import { useHistory } from "react-router-dom";
import { axiosReq } from "../../api/axiosDefaults";

function PostCreateForm() {
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
		// to send image file, need to access imageInput component and get the first file in the current attributes array
		formData.append('image', imageInput.current.files[0]);

		// because we're sending image file and text, the API will need to refresh 
		// the user's access token before the create post request can be made
		// to do this:
		try {
			// 1. import and use axiosReq instance
			// 2. post formData to the post endpoint of the API
			// before you get the image, the token is refreshed to allow the image to be uploaded
			// therefore you need to use the axiosReq to request that token
			const {data} = await axiosReq.post('/posts/', formData);
			// 3. API will respond with data about newly created post, with id
			// 4. Create unique url for the post, but adding the id to the posts url string
			// 5. Redirect user to the page of the newly created post
			history.push(`/posts/${data.id}`);
		} catch(err){
			// In case of error, log out to console
			console.log(err);
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
				create
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
							{/* 
							ternary expression:
								- show preview of user's image if chosen.
								- otherwise, show upload icon and message
							*/}
							{image ? (
								// fragment returns multiple elements
								<>
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
								</>
							) : (
									<Form.Label
										className="d-flex justify-content-center"
										htmlFor="image-upload"
									>
										<Asset src={Upload} message="Click or tap to upload an image" />
									</Form.Label>
								)
							}

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

export default PostCreateForm;
