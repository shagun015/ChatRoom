import React from 'react'
import styles from './Button.module.css'
import {Link} from 'react-router-dom'
const Button = ({title,onclick}) => {
  return(
    <button onClick={onclick} className={styles.button}>
        <span>{title}</span>
        <img className={styles.arrow} src="/images/arrow-forward.png" alt="" />
    </button>
  )
}

export default Button;