
fetch('https://chat-radio.com/downloads/Gnarls%20Barkley%20-%20Crazy%20(Official%20Video).mp3',{
  cors:'no-cors'
})
  .then(response => {
    const reader = response.body.getReader()
    return new ReadableStream({

      start(controller) {
        return pump();
        function pump() {
          return reader.read().then(({ done, value }) => {
            // When no more data needs to be consumed, close the stream
            if (done) {
              controller.close();
              return;
            }
            // Enqueue the next data chunk into our target stream
            controller.enqueue(value);
            return pump();
          });
        }
      }
    })
  })
  .then(stream => new Response(stream))
  .then(response => response.blob())
  .then(blob => URL.createObjectURL(blob))
  .then(song=>{
    // var song = URL.createObjectURL(blob)
    console.log(typeof(song), song)
    var myAudioEl = new Audio(song)
    myAudioEl.play()

  })
  .catch(err => console.error(err));


// .then(stream => new Response(stream))
// .then(response => response.blob())
// .then(blob => {console.log(blob.type, blob.size, blob)})
// .catch(err => console.error(err));

// .then(stream => new Response(stream))
// .then(response => response.blob())
// .then(blob => URL.createObjectURL(blob))
// .then(url => console.log(image.src = url))
// .catch(err => console.error(err));
