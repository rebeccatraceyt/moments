import React, { useState } from "react";
import { Media } from "react-bootstrap";
import { Link } from "react-router-dom";
import { axiosRes } from "../../api/axiosDefaults";
import Avatar from "../../components/Avatar";
import { MoreDropdown } from "../../components/MoreDropdown";
import { useCurrentUser } from "../../contexts/CurrentUserContext";
import styles from "../../styles/Comment.module.css"
import CommentEditForm from "./CommentEditForm";

const Comment = (props) => {
    const {
        profile_id,
        profile_image,
        owner,
        updated_at,
        content,
        id,
        setPost,
        setComments,
    } = props;

    // define current user with useCurrentUser hook export
    const currentUser = useCurrentUser();

    // check if the owner of the post matches the current user's username
    // if it does, asign it the value of is_owner
    const is_owner = currentUser?.username === owner;
    
    // destructured props used to toggle edit form
    const [ showEditForm, setShowEditForm ] = useState(false);

    // function to handle comment deletion
    const handleDelete = async () => {
        try {
            // make delete requestions to comments/:id endpoint
            await axiosRes.delete(`/comments/${id}`);

            // if all is well, update post results array with new comment count
            setPost(prevPost => ({
                // function returns object with updated post results array
                // spread previous post object and reduce comments_count by one
                results: [{
                    ...prevPost.results[0],
                    comments_count: prevPost.results[0].comments_count - 1
                }]

            }));

            setComments(prevComments => ({
                // function to remove deleted comment from state
                // spread comments
                // call filter function to loop over previous comments results array
                // if the id is for comment to be removed:
                //      filter method will not return it in the updated array
                ...prevComments,
                results: prevComments.results.filter((comment) => comment.id !== id),
            }))
        } catch (err) {
            console.log(err);
        }
    };

    return (
        <>
            <hr />
            <Media>
                <Link to={`/profiles/${profile_id}`}>
                    <Avatar src={profile_image} />
                </Link>
                <Media.Body className="align-self-center ml-2">
                    <span className={styles.Owner}>{owner}</span>
                    <span className={styles.Date}>{updated_at}</span>
                    {
                        showEditForm ? (
                            <CommentEditForm
                                id={id}
                                profile_id={profile_id}
                                content={content}
                                profileImage={profile_image}
                                setComments={setComments}
                                setShowEditForm={setShowEditForm}
                            />
                        ) : (
                            <p>{content}</p>
                        )
                    }
                </Media.Body>
                {is_owner && !showEditForm && (
                    <MoreDropdown
                        handleEdit={() => setShowEditForm(true)}
                        handleDelete={handleDelete}
                    />
                )}
            </Media>
        </>
    );
};

export default Comment;
