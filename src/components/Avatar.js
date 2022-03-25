import React from 'react'
import styles from '../styles/Avatar.module.css'

const Avatar = ({ src, height = 45, text}) => {
    // parameters destructure the props in place
    // ensures avatar always receives a src prop and may also receive height and text props
    // destructured with default value for height prop to set standard size for avatar component 

    return (
        <span>
            <img className={styles.Avatar} src={src}
            height={height} width={height} alt="user avatar" />
            {text}
        </span>
    )
}

export default Avatar