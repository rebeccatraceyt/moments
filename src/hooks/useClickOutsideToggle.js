import { useEffect, useRef, useState } from 'react'

const useClickOutsideToggle = () => {

    // destructured variables for hamburger menu
    // initial state will be false, which means that the menu will initally be collapsed
    const [expanded, setExpanded] = useState(false);

    // instantiate a ref variable that will hold a reference to the burger icon
    // with an inital value of null
    // the NavBar toggle is saved in the ref variable's current attribute, to be used
    const ref = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            // toggle state is recorded in ref - used to check if the element has been assigned to it (user has clicked on it)
            // then check if the user has clicked away from the reference button (toggle)
            if (ref.current && !ref.current.contains(event.target)){
                // if they have clicked away, setExpanded is set to false and closes the menu
                setExpanded(false);
            }
        }

        // mouseup event listener with the handleclick event as it's callback
        document.addEventListener('mouseup', handleClickOutside)

        return () => {
            // cleanup function to remove the event listener to be sure no event listener is left behind
            // removed in case it uses an element that could unmount
            document.removeEventListener('mouseup', handleClickOutside)
        }

    // ref variable is placed in the useEffect dependency array
    }, [ref]);
    
    // return object that contains everything the NavBar component needs
    return { expanded, setExpanded, ref};
}

export default useClickOutsideToggle