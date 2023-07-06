const db = require('../controllers/controller')
var fs = require('fs');
const filePath = './data.json';
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
        socket.on("get-log", ()=>{
            fs.readFile(filePath, 'utf8', (err, data) => {
            if (err) {
              console.error('Read file error, err num:', err);
              return;
            }
            const jsonStrings = data.trim().split('\n');
            socket.emit('history-log', jsonStrings);
        });
        })
    })
}