// how to run a test: 
// 1. render the component to be tested
// 2. target specific elements on the screen using query method
// (optional). interact with the returned elements (simulate a user click)
// 3. make assertions

import { fireEvent, render, screen } from "@testing-library/react";
import { BrowserRouter as Router } from 'react-router-dom';
import { CurrentUserProvider } from "../../contexts/CurrentUserContext";
import NavBar from "../NavBar";

test('renders NavBar', () => {
    render(
        // Router component needs to wrap around auto-imported component to render Router Link components
        <Router>
            <NavBar />
        </Router>
    );

    // check rendered HTML
    // works like clg and can be placed anywhere
    // screen.debug();

    // assert that sign in button is there
    //  - getByRole method allows us to search for links
    //  - methods that start with get are synchronous code
    const signInLink = screen.getByRole('link', {name: 'Sign In'})

    // assert if sign in link is present in the document
    //  - toBeInTheDocument method
    //  - preceed with 'not' to make the test fail
    //      - following the red-green-refactor principle
    // expect(signInLink).not.toBeInTheDocument();
    expect(signInLink).toBeInTheDocument();

});

// asynchronous because test is fetching data and we need to await changes in the documenet
test('renders link to the user profile for a logged in user', async () => {
    render(
        // Router component needs to wrap around auto-imported component to render Router Link components
        <Router>
            <CurrentUserProvider>
                <NavBar />
            </CurrentUserProvider>
        </Router>
    );

    // with async, we are not waiting for any UI changes in the test, 
    // so JEST moves on without waiting for request and state update to finish.
    // findByText query method needed (with await keyword) to target elements that aren't there on mount.
    const profileAvatar = await screen.findByText('Profile');

    // assert that the profileAvatar can be found in the document
    expect(profileAvatar).toBeInTheDocument();
});

// asynchronous because test is fetching data and we need to await changes in the documenet
test('renders Sign In and Sign Out buttons again, on log out', async () => {
    render(
        // Router component needs to wrap around auto-imported component to render Router Link components
        <Router>
            <CurrentUserProvider>
                <NavBar />
            </CurrentUserProvider>
        </Router>
    );

    // with async, we are not waiting for any UI changes in the test, 
    // so JEST moves on without waiting for request and state update to finish.
    // findByRole query method needed (with await keyword) to target elements that aren't there on mount.
    const signOutLink = await screen.findByRole('link', {name: 'Sign Out'});

    // simulate mock user interaction - click event
    fireEvent.click(signOutLink);

    // with sign out link clicked, 
    // wait for sign in and sign up likes to be rendered from NavBar
    // then check they are in the document
    const signInLink = await screen.findByRole('link', {name: 'Sign In'})
    const signUpLink = await screen.findByRole('link', {name: 'Sign Up'})

    expect(signInLink).toBeInTheDocument();
    expect(signUpLink).toBeInTheDocument();
});