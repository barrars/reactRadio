
/**
 *
 *
 * @param {LocalForage} myDB
 */
export default function getSongList (setSongList, myDB ) {
  // fetch('http://localhost:3001/songlist')
  fetch('https://chat-radio.com/songlist')
    .then(res => {
      console.log(res)

      if (!res.ok) {
        myDB.keys()
        .then(keys=>{
          setSongList(keys)
        })
        console.log('return?')
        setSongList('err')
        throw new Response({ok:false})
      }
      console.log('res?')
      setSongList('done')
      res.json()
      .then(json => {
        console.log('we okay!')
        let undeletedSongs = []
        json.forEach(e => {
          return e.deleted ? null :
          undeletedSongs.push(e)
        })
        console.log(undeletedSongs.length, ' songs fetched')
        // console.log(undeletedSongs)
        setSongList(undeletedSongs)
      })
    })
    .catch(err => {
      setSongList('err')
      console.error({msg:'offline?', err})
    })
}