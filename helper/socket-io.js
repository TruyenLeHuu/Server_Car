const db = require('../controllers/controller')
module.exports = function (io, mqtt) {
    io.on("connection", function (socket) {
        console.log("Socket connected")
        socket.on("disconnect",()=>{
            console.log("Socket disconnected")
        })
    })
}