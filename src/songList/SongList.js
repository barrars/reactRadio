import React, { useState, useEffect } from 'react'
import Song from '../song/Song'
import getSonglist from '../helpers/getSongList'
import { cacheSongHandler, deleteSongHandler } from '../helpers/cacheSongHandlers'
import { mainStore } from '../helpers/mainStore'

export default function SongList() {
  useEffect(() => { getSonglist(setSongList) }, [])
  useEffect(() => {mainStore.keys().then(keys => {
    console.log('main store ' , keys)
      setCachedSongs(keys)
    })
  }, [])
  const [songList, setSongList] = useState('fetching')
  const [currentSong, setCurrentSong] = useState('')
  const [cachedSongs, setCachedSongs] = useState('fetching')
  const [playCachedSong, setplayCachedSong] = useState('')
  const songClickHandler = (e) => {
    // let song = encodeURI(e.target.innerText.trim())
    let song = e.target.innerText
    console.log(song)
    setCurrentSong(song)
  }
  const playCachedSongHandler = song => {
    mainStore.getItem(song)
      .then(data => {
        setplayCachedSong(URL.createObjectURL(data))
      })
  }
  let onlineAudio
  let offlineAudio
  // let devurl = 'http://localhost:3001'
  let produrl = 'https://chat-radio.com'
  if (playCachedSong) offlineAudio = <audio autoPlay src={playCachedSong} />

  if (currentSong) onlineAudio = <audio autoPlay src={`${produrl}/downloads/${currentSong}`} />
  console.log('cached songs: ', cachedSongs)
  console.log('songlist: ', songList)

  if (songList === 'fetching' || songList === 'done' || cachedSongs==='fetching') {
    return (
      <p>Trying to Fetch Songs.....</p>
    )
  } else if (songList === 'err' && cachedSongs.length>0) {
    console.log('offline!!')
    return (
      <div>
        {cachedSongs.map((song, i) => {
          return (
            <div key={i}>
              <Song name={song} />
              <button onClick={playCachedSongHandler.bind(this, song)}>Play From Cache</button>
            </div>
          )
        })}
        {offlineAudio}
      </div>
    )
  }
  else {
    return (
      <div>
        <div>
          {songList.map((song, i) => {
            return song.deleted ? null :
              <div key={song.fileSlug}>
                <Song name={song.fileName} click={songClickHandler} />
                {cachedSongs.includes(song.fileName)
                  ? <button onClick={deleteSongHandler.bind(this, song.fileName, mainStore, setCachedSongs)}>delete this song</button>
                  : <button onClick={cacheSongHandler.bind(this, song.fileName, mainStore, setCachedSongs)}>save this song</button>
                }
              </div>
          })}
        </div>
        {onlineAudio}
      </div>
    )
  }
}


