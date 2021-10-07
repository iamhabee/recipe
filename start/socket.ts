import News from 'App/Services/News'
News.boot()

/**
 * Listen for incoming socket connections
 */
News.io.on('connection', (socket) => {
  socket.emit('news', { hello: 'world' })

  socket.on('classroom', (data, room) => {
    socket.to(room).emit('recieve-message', data)
    console.log(data)
  })

  socket.on('send-message', (data, room) => {
    socket.to(room).emit('recieve-message', data)
    // socket.broadcast.emit('recieve-message', data)
    // console.log(data)

  })

  socket.on('notifications', (data) => {
    console.log(data)
  })
})
