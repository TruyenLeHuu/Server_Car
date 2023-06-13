var mqtt = require('mqtt');
var fs = require('fs');
var config = require('../config/config')
var client = mqtt.connect('mqtt://' + config.mqtt_host + ":" + config.mqttPort, {
    clientId: 'Server_Client',
    reconnectPeriod: 1000,
    keepalive: 300,
    clean: false,
});
const filePath = './data.json';
module.exports = function (io) {
    client.on('connect', function () {
        // client.subscribe('/Status/Connected', {qos: 1});
        // client.subscribe('/Status/Disconnected', {qos: 1});
        client.subscribe('/Status/Power', {qos: 1});
        client.subscribe('/Status/Speed', {qos: 1});
        client.subscribe('/Status/Sensor', {qos: 1});
        client.subscribe('/Status/Light', {qos: 1});
        client.subscribe('/Status/Unknown', {qos: 1});
        
    });
    client.on('message', function (topic, message) {

        io.sockets.emit('Log-msg', (message.toString()).length > 10 ? JSON.parse(message.toString()) : message.toString());
        
        let date_ob = new Date();
        // current date
        // adjust 0 before single digit date
        let date = ("0" + date_ob.getDate()).slice(-2);
        // current month
        let month = ("0" + (date_ob.getMonth() + 1)).slice(-2);
        // current year
        let year = date_ob.getFullYear();
        // current hours
        let hours = date_ob.getHours();
        // current minutes
        let minutes = date_ob.getMinutes();
        // current seconds
        let seconds = date_ob.getSeconds();
        // current seconds
        let miliseconds = date_ob.getMilliseconds();

        var jsonString ={
            time: year + "-" + month + "-" + date + " " + hours + ":" + ((Math.floor(minutes / 10) > 0) ? "" : "0") + minutes + ":"+ ((Math.floor(seconds / 10) > 0) ? "" : "0") + seconds + ":" + ((Math.floor(miliseconds / 100) > 0) ? "" : "0") + ((Math.floor(miliseconds / 10) > 0) ? "" : "0") + miliseconds,
            topic: topic,
            message: message.toString()
        }
        fs.appendFile(filePath, JSON.stringify(jsonString) + '\n', 'utf8', (err) => {
            if (err) {
              console.error('Append file error, err num:', err);
              return;
            }
            // console.log('File append successful.');
          });
        // fs.readFile(filePath, 'utf8', (err, data) => {
        //     if (err) {
        //       console.error('Read file error, err num:', err);
        //       return;
        //     }

        //     const jsonStrings = data.trim().split('\n');

        //     jsonStrings.forEach((jsonString, index) => {
        //       try {
        //         const jsonData = JSON.parse(jsonString);
        //         console.log(`Json string ${index + 1}:`, jsonData.time);
        //       } catch (error) {
        //         console.error(`Json string error num${index + 1}:`, error);
        //       }
        //     })
        // });
        switch (topic) {
            case '/Status/Connected':
                console.log("Connect: " + message.toString());
                io.sockets.emit('Hardware-connect', message.toString());
                break;
            case '/Status/Disconnected':
                console.log("Disconnect: "+ message.toString() + " "+ year + "-" + month + "-" + date + " " + hours + ":" + minutes + ":" + seconds);
                io.sockets.emit('Hardware-disconnect', message.toString());
                break;
            case '/Status/Power':
                console.log("Power: " + message.toString());
                io.sockets.emit('Status-Power', message.toString());
                break;
            case '/Status/Sensor':
                console.log("Sensor: " + message.toString());
                io.sockets.emit('Status-Sensor', message.toString());
                break;
            case '/Status/Light':
                console.log("Light: " + message.toString());
                io.sockets.emit('Status-Light', message.toString());
                break;
            case '/Status/Speed':
                console.log("Engin node: " + message);
                io.sockets.emit('Status-Speed', message.toString());
                break;
        }
    });
    exports.sendCanMsg = function (data) {
        client.publish('/Car_Control/Msg', JSON.stringify(data), {qos: 1, retain: false});
    }
    return exports;
}
