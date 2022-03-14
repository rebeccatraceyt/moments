import React from 'react';
import { Container, Navbar, Nav } from 'react-bootstrap';
import logo from '../assets/logo.png';
import styles from '../styles/NavBar.module.css';
// Import NavLink component from React router library
import { NavLink } from 'react-router-dom';
import { useCurrentUser } from '../contexts/CurrentUserContext';
// import { CurrentUserContext } from '../App'; - needed before useSetCurrentUser context import
// import { useContext } from "react"; - needed before useSetCurrentUser context import

const NavBar = () => {

    // import the current user context from sign in
    // const currentUser = useContext(CurrentUserContext); - not needed with CurrentUserContext.js

    // import useCurrentUser hook from contexts
    const currentUser = useCurrentUser();

    // display appropriate content when user is logged in
    const loggedInIcons = <>{currentUser?.username}</>

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
        <Navbar className={styles.NavBar} expand="md" fixed="top">
            <Container>
                {/* 'to' prop works like href attribute on an anchor tag */}
                <NavLink to='/'>
                    <Navbar.Brand><img src={logo} alt="logo" height="45" /></Navbar.Brand>
                </NavLink>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="ml-auto text-left">
                        {/* 'exact' prop ensures the URL is explicitly just a slash (/), so the active class is only on homepage  */}
                        <NavLink exact className={styles.NavLink} activeClassName={styles.Active} to='/'>
                            <i className='fas fa-home'></i> Home
                        </NavLink>
                    </Nav>
                    {currentUser ? loggedInIcons : loggedOutIcons}
                </Navbar.Collapse>
            </Container>
        </Navbar>
    )
}

export default NavBar