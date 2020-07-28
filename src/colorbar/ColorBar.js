import React, { useState } from 'react'
import localforage, {INDEXEDDB } from 'localforage'

export default function ColorBar() {
  const mainStoreage = localforage.createInstance({
    name: 'mainStore',
    description: 'Main instance',
    driver: INDEXEDDB
  })
  const [song, setSong] = useState('blank')
  const playSong = () => {
    const myAudio = document.getElementById('audio')
    console.log('play song clicked')
    mainStoreage.getItem('song2')
      .then(data => {
        let songData = URL.createObjectURL(data)
        console.log(songData)
        setSong(data)
        console.log(song)
        myAudio.src = songData
      })
      .catch(err => console.error(err))
  }
  const getSong = () => {
    fetch('http://localhost:3001/downloads/The Game & Skrillex - “El Chapo” copy.mp3', {
    })
      .then(response => {
        for (const entry of response.headers.entries()) {
          console.log(entry)
        }
        const reader = response.body.getReader()

        return new ReadableStream({
          start(controller) {
            return pump();
            function pump() {
              return reader.read().then(({ done, value }) => {
                if (done) {
                  controller.close();
                  return;
                }
                controller.enqueue(value);
                return pump();
              });
            }
          }
        })
      })
      .then(stream => new Response(stream))
      .then(response => {
        response.headers.forEach(console.log);

        response.blob()
          .then(song => {
            // let playMe = URL.createObjectURL(song)
            mainStoreage.setItem("song2", song)
            .then(() => mainStoreage.getItem('song2'))
            .then(i => {
              let song =  URL.createObjectURL(i)
              console.log(song)

                setSong(i)
              })
          })

      }).catch(err => console.error(err))

    // .catch (err => console.error(err));
    console.log('GEEEEET SONGGGGGG')

  }

  const [color, setColor] = useState('')
  const changeColor = (e) => {
    let newColor = e.target.value
    setColor(newColor)
  }



  // secondStore.setItem("secondColor", 'blue')
  // .then(()=>
  // secondStore.iterate((v, k, i)=>{
  // console.log([k, v, i])
  // console.log(secondStore.driver())
  // })
  // )
  // localforage.iterate((v, k, i)=>{
  // console.log([k, v, i])
  // console.log(localforage.driver())
  // })


  return (
    <div>
      <input style={{ background: color }} type="text" onChange={changeColor} />
      <input style={{ background: color }} type="text" onChange={changeColor} />
      <button onClick={getSong}>download song!</button>
      <button onClick={playSong}>Play Song</button>
      <audio id='audio' src={song} autoPlay controls></audio>

    </div>
  )
}
