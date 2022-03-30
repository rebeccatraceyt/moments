import React from "react";
import { Card, Media, OverlayTrigger, Tooltip } from "react-bootstrap";
import { Link } from "react-router-dom";
import Avatar from "../../components/Avatar";
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
    } = props;

    // define current user with useCurrentUser hook export
    const currentUser = useCurrentUser();

    // check if the owner of the post matches the current user's username
    // if it does, asign it the value of is_owner
    const is_owner = currentUser?.username === owner;


    return ( 
        <Card className={styles.Post}>

            <Card.Body>
                <Media className="align-items-center justify-content-between">
                    <Link to={`/profiles/${profile_id}`}>
                        <Avatar src={profile_image} height={55}/>
                        {owner}
                    </Link>
                    <div className="d-flex align-items-center">
                        <span>{updated_at}</span>
                        {/* checking if currently logged in user is the owner and if postPage prop exists
                            if so, display the edit and delete options for the user */}
                        {is_owner && postPage && "..."}
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
                        <span onClick={() => {}}>
                            <i className={`fas fa-heart ${styles.Heart}`} />
                        </span>
                    ) : currentUser ? (
                        <span onClick={() => {}}>
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
