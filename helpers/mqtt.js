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
        client.subscribe('Data/#', {qos: 1});
        // client.subscribe('Data/Disconnected', {qos: 1}); 
        // client.subscribe('Data/Power', {qos: 1});
        // client.subscribe('Data/Speed', {qos: 1});
        // client.subscribe('Data/Sensor', {qos: 1});
        // client.subscribe('Data/Location', {qos: 1});
        // client.subscribe('Data/IMUEuler', {qos: 1});
        // client.subscribe('Data/IMUAccel', {qos: 1});
        // client.subscribe('Data/IMUGyro', {qos: 1});
        client.subscribe('CarControl/SteerAngle', {qos: 1});
        client.subscribe('CarControl/Speed', {qos: 1});
        client.subscribe('CarControl/Light', {qos: 1});
    });
    client.on('message', function (topic, message) {
        
        // console.info(topic, message.toString());

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
            message: (message.toString()).length > 10 ? JSON.parse(message.toString()) : message.toString()
        }
        io.sockets.emit('Log-msg', jsonString);
        
        fs.appendFile(filePath, JSON.stringify(jsonString) + '\n', 'utf8', (err) => {
            if (err) {
              console.error('Append file error, err num:', err);
              return;
            }
          });
        // console.log("topic ", topic, "message ", message.toString())
        switch (topic) {
            case 'Data/Connected':
                console.log("Connect: " + message.toString());
                io.sockets.emit('Hardware-connect', message.toString());
                break;
            case 'Data/Disconnected':
                console.log("Disconnect: "+ message.toString() + " "+ year + "-" + month + "-" + date + " " + hours + ":" + minutes + ":" + seconds);
                io.sockets.emit('Hardware-disconnect', message.toString());
                break;
            case 'Data/Power':
                console.log("Power: " + message.toString());
                io.sockets.emit('Data-Power', message.toString());
                break;
            case 'Data/Sensor':
                console.log("Sensor: " + message.toString());
                io.sockets.emit('Data-Sensor', message.toString());
                break;
            case 'Data/Speed':
                console.log("Light: " + message.toString());
                io.sockets.emit('Data-Light', message.toString());
                break;
            case 'Data/Location':
                console.log("Location: " + message.toString());
                io.sockets.emit('Data-Location', message.toString());
                break;
            case 'Data/IMUEuler':
                console.log("IMUEuler: " + message.toString());
                io.sockets.emit('Data-IMUEuler', message.toString());
                break;
            case 'Data/IMUAccel':
                console.log("IMUAccel: " + message.toString());
                io.sockets.emit('Data-IMUAccel', message.toString());
                break;
            case 'Data/IMUGyro':
                console.log("IMUGyro: " + message.toString());
                io.sockets.emit('Data-IMUGyro', message.toString());
                break;
        }
    });
    exports.sendCanMsg = function (data) {
        client.publish('CarControl/Msg', JSON.stringify(data), {qos: 1, retain: false});
        console.log(data)
        // client.publish('CarControl/SteerAngle', "#2=-50\r\n", {qos: 1, retain: false});

        // client.publish('Data/Location', JSON.stringify({
        //     node_id : 13,
        //     lat: 10.86951,
        //     long: 106.80232,
        // }), {qos: 1, retain: false});
        // client.publish('Data/Location', JSON.stringify({
        //     node_id : 13,
        //     lat: 10.86937, 
        //     long: 106.80240,
        // }), {qos: 1, retain: false})
        // client.publish('Data/Location', JSON.stringify({
        //     node_id : 13,
        //     lat: 10.86931, 
        //     long: 106.80275,
        // }), {qos: 1, retain: false});

    }
    return exports;
}
