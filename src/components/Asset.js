import React from "react";
import Spinner from "react-bootstrap/Spinner";
import styles from "../styles/Asset.module.css";

// destructure the props the asset component will recieve
// makes it a multi-purpos component to render any combination of props passed

const Asset = ({ spinner, src, message }) => {
    return (
        <div className={`${styles.Asset} p-4`}>
            {/*
               double apersand (&) first checks if the prop exists
               if it does, then render the element within the boolean expression.
               For example, if spinner prop is not passed:
                    - it's value is undefined
                    - spinner component will not render
            */}
            {spinner && <Spinner animation="border" />}
            {src && <img src={src} alt={message} />}
            {message && <p className="mt-4">{message}</p>}
        </div>
    );
};

export default Asset;
