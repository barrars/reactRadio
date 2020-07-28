import React from 'react'
import styles from './song.module.css'
export default function Song(props) {
  return (
    <div  className={`${styles.hover} ${styles.pre}`}>
      <p onClick={props.click}>{props.name}</p>
    </div>
  )
}
