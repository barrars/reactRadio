import React from 'react';
import styles from './App.module.css';
import SongList from './songList/SongList';


const App = ()=>  (
        <div className={styles.cheek}>
          <h1>Hi, I'm an old React App</h1>
          <SongList/>
        </div>
    )



export default  App;
