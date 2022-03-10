import NavBar from './components/NavBar';
import styles from './App.module.css';
import Container from 'react-bootstrap/Container';
// Import Switch and Route components to set up routing.
import { Route, Switch } from 'react-router-dom';
import './api/axiosDefaults';
import SignUpForm from './pages/auth/SignUpForm';

function App() {
    return (
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
                    <Route exact path='/signin' render={()=> <h1>Sign In</h1>}/>
                    <Route exact path='/signup' render={()=> <SignUpForm />}/>
                    <Route render={()=> <p>Oops! Page not found.</p>}/>
                </Switch>
            </Container>
        </div>
    );
}

export default App;
