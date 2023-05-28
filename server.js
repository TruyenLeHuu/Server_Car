const express = require('express');
const appExpress = express();
appExpress.use(express.static("./public"));
appExpress.set("view engine", "ejs");
appExpress.set("views", "./views");
const bodyParser = require('body-parser');
const config = require('./config/config');
const dotenv = require('dotenv');
const mongoose = require('mongoose');

appExpress.use(bodyParser.urlencoded({extended:true, limit:"30mb" }));
appExpress.use(bodyParser.json());

const URI = 'mongodb+srv://1111:1234@golfcart.nr6xmoy.mongodb.net/GOLF_CART?retryWrites=true&w=majority'
// const URI = 'mongodb://localhost:27017/test'

dotenv.config();

global.__basedir  =  __dirname;

var server = require("http").Server(appExpress);

//socket io and pass port
var io = require("socket.io")(server);

//Import routes
const route = require('./routes/route')(io);
//MQTT
const mqtt = require('./mqtt/mqtt')(io);
//Route middleware
appExpress.use('/', route);

require('./helper/socket-io')(io, mqtt);

mongoose
.connect(URI, {useNewUrlParser:true, useUnifiedTopology:true})
.then(()=>{
    console.log("Connected to db")
    //InitRole()
    appPort = config.port;
	appHost = config.host;
	server.listen(appPort, appHost, () => {
		console.log(`Server listening at host ${appHost} port ${appPort}`);
});
}).catch((err) => {
    console.log(err)
})

