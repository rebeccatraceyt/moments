import React from 'react';
import { Container, Navbar, Nav } from 'react-bootstrap';
import logo from '../assets/logo.png';
import styles from '../styles/NavBar.module.css';
// Import NavLink component from React router library
import { NavLink } from 'react-router-dom';

const NavBar = () => {
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
                        <NavLink className={styles.NavLink} activeClassName={styles.Active} to='/signin'>
                            <i className='fas fa-sign-in-alt'></i> Sign In
                        </NavLink>
                        <NavLink className={styles.NavLink} activeClassName={styles.Active} to='/signup'>
                            <i className='fas fa-user-plus'></i> Sign Up
                        </NavLink>
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    )
}

export default NavBar