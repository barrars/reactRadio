
/**
 *
 * @param {String} name
 * @param {LocalForage} myDB
 */

export function cacheSongHandler (name, myDB, cacheState) {
  // console.log(myDB)
  console.log('RUNNING add SONG to cache')
  fetch(`https://chat-radio.com/downloads/${name}`)
  // fetch(`http://localhost:3001/downloads/${name}`)
    .then(response => {
      // response.headers.forEach(console.log);
      // for (const entry of response.headers.entries()) {
      //   console.log(entry)
      // }
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
        response.blob()
        .then(song => {
          myDB.setItem(name, song)
          .then(song=>{
            console.log('CACHED ', song)
            myDB.keys()
            .then(keys=>cacheState(keys))
          })
        })
    }).catch(err => console.error(err))

}

/**
 *
 * @param {String} name
 * @param {LocalForage} myDB
 */
export function deleteSongHandler(name, myDB, cacheState){
  console.log('RUNNING remove from cache')

myDB.removeItem(name)
.then(()=>{
  console.log('hey is cleared')
  myDB.keys().then(keys=>{
    cacheState(keys)
  })
})

}