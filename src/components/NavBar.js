import React from 'react';
import Navbar from "react-bootstrap/Navbar";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import logo from '../assets/logo.png';
import styles from '../styles/NavBar.module.css';
// Import NavLink component from React router library
import { NavLink } from 'react-router-dom';
import { useCurrentUser, useSetCurrentUser } from '../contexts/CurrentUserContext';
import Avatar from './Avatar';
import axios from 'axios';
import useClickOutsideToggle from '../hooks/useClickOutsideToggle';
import { removeTokenTimestamp } from '../utils/utils';
// import { CurrentUserContext } from '../App'; - needed before useSetCurrentUser context import
// import { useContext } from "react"; - needed before useSetCurrentUser context import

const NavBar = () => {

    // import the current user context from sign in
    // const currentUser = useContext(CurrentUserContext); - not needed with CurrentUserContext.js

    // import useCurrentUser hook from contexts
    const currentUser = useCurrentUser();
    const setCurrentUser = useSetCurrentUser();

    // access toggle values from file, and destructure them
    const {expanded, setExpanded, ref} = useClickOutsideToggle();

    // sign out logic
    const handleSignOut = async () => {
        try {
            await axios.post('dj-rest-auth/logout/');
            setCurrentUser(null);
            
            // remove time stamp when needed (when refresh token expires or user logs out)
            removeTokenTimestamp();
        } catch(err){
            console.log(err);
        }
    };

    const addPostIcon = (
        <>
            <NavLink className={styles.NavLink} activeClassName={styles.Active} to='/posts/create'>
                <i className='far fa-plus-square'></i> Add Post
            </NavLink>
        </>
    );

    // display appropriate content when user is logged in
    // this displays the username when logged in
    // const loggedInIcons = <>{currentUser?.username}</>
    const loggedInIcons = (
        <>
            <NavLink className={styles.NavLink} activeClassName={styles.Active} to='/feed'>
                <i className='fas fa-stream'></i> Feed
            </NavLink>
            <NavLink className={styles.NavLink} activeClassName={styles.Active} to='/liked'>
                <i className='fas fa-heart'></i> Liked
            </NavLink>
            <NavLink className={styles.NavLink} to='/' onClick={handleSignOut}>
                <i className='fas fa-sign-out-alt'></i> Sign Out
            </NavLink>
            <NavLink className={styles.NavLink} to={`/profiles/${currentUser?.profile_id}`}>
                <Avatar src={currentUser?.profile_image} text="Profile" height={40} />
            </NavLink>
        </>
    )

    // display appropriate icons when user is logged out
    const loggedOutIcons = (
        <>
            <NavLink className={styles.NavLink} activeClassName={styles.Active} to='/signin'>
                <i className='fas fa-sign-in-alt'></i> Sign In
            </NavLink>
            <NavLink className={styles.NavLink} activeClassName={styles.Active} to='/signup'>
                <i className='fas fa-user-plus'></i> Sign Up
            </NavLink>
        </>
    );


    return (
        // expanded attribute specifies that here we want to expand the navbar
        <Navbar expanded={expanded} className={styles.NavBar} expand="md" fixed="top">
            <Container>

                {/* 'to' prop works like href attribute on an anchor tag */}
                <NavLink to='/'>
                    <Navbar.Brand><img src={logo} alt="logo" height="45" /></Navbar.Brand>
                </NavLink>

                {/* conditional that addPostIcon will only show when currentUser exists (user is logged in) */}
                {currentUser && addPostIcon}

                {/* 
                    onclick will allow toggle of menu using the expanded state when burger icon is clicked 
                    ref prop passed to ref value to allow reference to the DOM element and detect whether user has 
                    clicked inside or outside of it.
                */}
                <Navbar.Toggle
                    ref={ref}
                    onClick={() => setExpanded(!expanded)}
                    aria-controls="basic-navbar-nav"
                />

                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="ml-auto text-left">
                        {/* 'exact' prop ensures the URL is explicitly just a slash (/), so the active class is only on homepage  */}
                        <NavLink exact className={styles.NavLink} activeClassName={styles.Active} to='/'>
                            <i className='fas fa-home'></i> Home
                        </NavLink>
                        {currentUser ? loggedInIcons : loggedOutIcons}
                    </Nav>
                </Navbar.Collapse>

            </Container>
        </Navbar>
    )
}

export default NavBar