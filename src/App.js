import NavBar from './components/NavBar';
import styles from './App.module.css';
import Container from 'react-bootstrap/Container';
// Import Switch and Route components to set up routing.
import { Route, Switch } from 'react-router-dom';
import './api/axiosDefaults';
import SignUpForm from './pages/auth/SignUpForm';
import SignInForm from './pages/auth/SignInForm';
import { createContext, useEffect, useState } from 'react';
import axios from 'axios';

// set global user context
export const CurrentUserContext = createContext();
export const SetCurrentUserContext = createContext();

function App() {

    // persist the state of the currently logged in user
    const [ currentUser, setCurrentUser ] = useState(null);

    // network request to check who the user is, based on their credentials in the cookie
    // to do that, make a GET request to the user endpoint of the API
    // the network request is made when the component mounts
    const handleMount = async () => {
        try {
            // make a GET request to the user endpoint
            // destructure the data property
            const {data} = await axios.get('dj-rest-auth/user/');
            // set the currentUser to data by calling setCurrentUser with it
            setCurrentUser(data);
        } catch(err){
            console.log(err);
        }
    };

    useEffect(() => {
        handleMount();
    }, []);

    return (
        <CurrentUserContext.Provider value={currentUser}>
            {/* Provider component allows child component to subscribe to context changes
            It accepts a value prop to be passed to child components that need to consume the value
            In this case: currentUser and setCurrentUser
            This will allow the currentUser value and the function to update it and be available for every child component */}
            <SetCurrentUserContext.Provider value={setCurrentUser}>
                <div className={styles.App}>
                    <NavBar/>
                    <Container className={styles.Main}>
                        <Switch>
                            {/* 
                            - Switch holds all the Routes, and renders a given component when a Route path matches the current URL.
                            - The rendered prop on our Route component accepts a funtion that returns a component to be rendered when
                            the Route path is matched.
                            - The path prop is the browser URL the user will be at when they see the component in our render prop.
                            - The 'exact' prop tells the route to only render its component when the url entered is exactly the same. 
                            */}
                            <Route exact path='/' render={()=> <h1>Home Page</h1>}/>
                            <Route exact path='/signin' render={()=> <SignInForm/>}/>
                            <Route exact path='/signup' render={()=> <SignUpForm />}/>
                            <Route render={()=> <p>Oops! Page not found.</p>}/>
                        </Switch>
                    </Container>
                </div>
            </SetCurrentUserContext.Provider>
        </CurrentUserContext.Provider>
    );
}

export default App;
