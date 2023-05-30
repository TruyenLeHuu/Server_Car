var mqtt = require('mqtt');
var config = require('../config/config')
var client = mqtt.connect('mqtt://' + config.mqtt_host + ":" + config.mqttPort, {
    clientId: 'Server_Client',
    reconnectPeriod: 1000,
    keepalive: 300,
    clean: false,
});
module.exports = function (io) {
    client.on('connect', function () {
        client.subscribe('/Status/Connected', {qos: 1});
        client.subscribe('/Status/Disconnected', {qos: 1});
        client.subscribe('/Status/Power', {qos: 1});
        client.subscribe('/Status/Speed', {qos: 1});
        client.subscribe('/Status/Sensor', {qos: 1});
        client.subscribe('/Status/Light', {qos: 1});
    });
    client.on('message', function (topic, message) {
        switch (topic) {
            case '/Status/Connected':
                console.log("Connect: " + message.toString());
                io.sockets.emit('Hardware-connect', message.toString());
                break;
            case '/Status/Disconnected':
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
    return exports;
}
