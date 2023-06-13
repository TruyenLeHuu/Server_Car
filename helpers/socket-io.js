const db = require('../controllers/controller')
module.exports = function (io, mqtt) {
    io.on("connection", function (socket) {
        console.log("Socket connected")
        socket.on("disconnect",()=>{
            console.log("Socket disconnected")
        })
        socket.on("Send-To-Can", (data)=>{
            // console.log(data);
            mqtt.sendCanMsg(data);
        })
    })
}