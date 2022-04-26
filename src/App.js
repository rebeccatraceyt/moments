import NavBar from './components/NavBar';
import styles from './App.module.css';
import Container from 'react-bootstrap/Container';
// Import Switch and Route components to set up routing.
import { Route, Switch } from 'react-router-dom';
import './api/axiosDefaults';
import SignUpForm from './pages/auth/SignUpForm';
import SignInForm from './pages/auth/SignInForm';
import PostCreateForm from './pages/posts/PostCreateForm';
import PostPage from './pages/posts/PostPage';
import PostsPage from './pages/posts/PostsPage';
import { useCurrentUser } from './contexts/CurrentUserContext';
import PostEditForm from './pages/posts/PostEditForm';
import ProfilePage from './pages/profiles/ProfilePage';
import UsernameForm from './pages/profiles/UsernameForm';
import UserPasswordForm from './pages/profiles/UserPasswordForm';
import ProfileEditForm from "./pages/profiles/ProfileEditForm";

function App() {

    // know who the current user is
    const currentUser = useCurrentUser();
    const profile_id = currentUser?.profile_id || "";

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
                    <Route exact path='/' render={()=> (
                            <PostsPage message="No results found. Adjust the search keyword." />
                        )}
                    />
                    <Route exact path='/feed' render={()=> (
                            <PostsPage 
                                message="No results found. Adjust the search keyword or follow a user."
                                filter={`owner__followed__owner__profile=${profile_id}&`}
                            />
                        )}
                    />
                    <Route exact path='/liked' render={()=> (
                            <PostsPage
                                message="No results found. Adjust the search keyword or like a post."
                                filter={`likes__owner__profile=${profile_id}&ordering=-likes__created_at&`}
                            />
                        )}
                    />
                    <Route exact path='/signin' render={()=> <SignInForm/>}/>
                    <Route exact path='/signup' render={()=> <SignUpForm />}/>
                    <Route exact path="/posts/create" render={() => <PostCreateForm />}/>
                    {/* The colon means that id is a paramenter for the post url to be passed through it */}
                    <Route exact path='/posts/:id' render={() => <PostPage />}/>
                    <Route exact path='/posts/:id/edit' render={() => <PostEditForm />}/>
                    <Route exact path="/profiles/:id" render={() => <ProfilePage />} />
                    <Route exact path="/profiles/:id/edit/username" render={() => <UsernameForm />} />
                    <Route exact path="/profiles/:id/edit/password" render={() => <UserPasswordForm />} />
                    <Route exact path="/profiles/:id/edit" render={() => <ProfileEditForm />} />
                    <Route render={()=> <p>Oops! Page not found.</p>}/>
                </Switch>
            </Container>
        </div>
    );
}

export default App;
