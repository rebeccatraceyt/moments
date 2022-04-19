import React from "react";
import { Card, Media, OverlayTrigger, Tooltip } from "react-bootstrap";
import { Link, useHistory } from "react-router-dom";
import { axiosRes } from "../../api/axiosDefaults";
import Avatar from "../../components/Avatar";
import { MoreDropdown } from "../../components/MoreDropdown";
import { useCurrentUser } from "../../contexts/CurrentUserContext";
import styles from "../../styles/Post.module.css";

const Post = (props) => {

    // destructure props from post results, passed from parent component
    const {
        id,
        owner,
        profile_id,
        profile_image,
        comments_count,
        likes_count,
        like_id,
        title,
        content,
        image,
        updated_at,
        postPage,
        setPosts,
    } = props;
    // postPage prop from PostPage <Post /> component (boolean to check if user is on a single Post page)
    // setPosts imports setPosts function from parent (PostPage) to update likes_count

    // define current user with useCurrentUser hook export
    const currentUser = useCurrentUser();

    // check if the owner of the post matches the current user's username
    // if it does, asign it the value of is_owner
    const is_owner = currentUser?.username === owner;

    // set variable to redirect users to page
    const history = useHistory();

    // function to handle redirecting user to edit page
    const handleEdit = () => {
       history.push(`/posts/${id}/edit`)
    }

    // function to handle user deleting post
    const handleDelete = async () => {
        try {
            // make delete request with axiosRes instance to the post endpoint, with the post id
            // lets the API know which post the user is trying to delete
            await axiosRes.delete(`/posts/${id}/`);
            history.goBack();
        } catch(err){
            console.log(err);
        }
    };

    // function to handle users liking posts
    const handleLike = async () => {
        try {
            // make post request with axiosRes instance to the likes endpoint, with the post id
            // lets the API know which post the user is trying to like
            const { data } = await axiosRes.post('/likes/', {post:id});
            // after API request, update post data with setPosts
            //  - spread the previous posts object
            //  - update the results array:
            //         - map over the array
            //         - check if post id matches id of post that was liked
            //         - if it does:
            //              - return the post object with the likes count, incremented by one
            //              - return the like_id set to the id of the response data
            //         - if it doesn't:
            //              - return the post as normal (the map can only move onto the next post in the prevPost array)
            setPosts((prevPosts) => ({
                ...prevPosts,
                results: prevPosts.results.map((post) => {
                    return post.id === id
                    ? { ...post, likes_count: post.likes_count + 1, like_id: data.id }
                    : post;
                }),
            }));
        } catch(err){
            console.log(err);
        }
    }

    // function to handle users unliking posts
    const handleUnlike = async () => {
        try {
            // make delete request with axiosRes instance to the likes endpoint, with the post id
            // lets the API know which post the user is trying to like
            await axiosRes.delete(`/likes/${like_id}`);
            // after API request, update post data with setPosts
            //  - spread the previous posts object
            //  - update the results array:
            //         - map over the array
            //         - check if post id matches id of post that was unliked
            //         - if it does:
            //              - return the post object with the likes count, decremented by one
            //              - return the like_id set to null
            //         - if it doesn't:
            //              - return the post as normal (the map can only move onto the next post in the prevPost array)
            setPosts((prevPosts) => ({
                ...prevPosts,
                results: prevPosts.results.map((post) => {
                    return post.id === id
                    ? { ...post, likes_count: post.likes_count - 1, like_id: null }
                    : post;
                }),
            }));
        } catch(err){
            console.log(err);
        }
    }


    return ( 
        <Card className={styles.Post}>

            <Card.Body>
                <Media className="align-items-center justify-content-between">
                    ;
                    <div className="d-flex align-items-center">
                        <span>{updated_at}</span>
                        {/* checking if currently logged in user is the owner and if postPage prop exists (user is on single post page)
                            if so, display the edit and delete options for the user */}
                        {is_owner && postPage && (
                            <MoreDropdown 
                                handleEdit={handleEdit}
                                handleDelete={handleDelete}
                            />
                        )}
                    </div>
                </Media>
            </Card.Body>

            <Link to={`/posts/${id}`}>
                <Card.Img src={image} alt={title} />
            </Link>

            <Card.Body>
                {/* check if title and content props have been passed before we render the respective BS components */}
                {title && <Card.Title className="text-center">{title}</Card.Title>}
                {content && <Card.Text>{content}</Card.Text>}
                <div className={styles.PostBar}>

                    {/* 
                        1. check if user is the owner of the post (so they cannot like their own post)
                        2. then, if the current user isn't the owner, check if a like_id exists (if the user has liked the post)
                        3. check if user is logged in, if they are, they can like the post (if like_id doesn't exist)
                        4. if the user is not logged in, prompt to log in to like post
                    */}
                    {is_owner ? (
                        <OverlayTrigger placement="top" overlay={<Tooltip>You can't like your own post!</Tooltip>}>
                            <i className="far fa-heart" />
                        </OverlayTrigger>
                    ) : like_id ? (
                        <span onClick={handleUnlike}>
                            <i className={`fas fa-heart ${styles.Heart}`} />
                        </span>
                    ) : currentUser ? (
                        <span onClick={handleLike}>
                            <i className={`far fa-heart ${styles.HeartOutline}`} />
                        </span>
                    ) : (
                        <OverlayTrigger placement="top" overlay={<Tooltip>Log in to like posts!</Tooltip>}>
                            <i className="far fa-heart" />
                        </OverlayTrigger>
                    )}
                    {likes_count}

                    {/* comments icon to link to the post page and display number of comments */}
                    <Link to={`/posts/${id}`}>
                        <i className="far fa-comments" />
                    </Link>
                    {comments_count}

                </div>
            </Card.Body>
        </Card>
    )
};

export default Post;
