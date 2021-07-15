var config = require("./config")();

const WebSocket = require('ws');
const ws = new WebSocket(config.echoserver);

ws.on('open', function open() {
	ws.send('Im relay connected');
	console.log("Connection established to echo server.");
});

var logfile = config.logfile;

Tail = require('tail').Tail;
tail = new Tail(logfile);

var dataBuffer;

tail.on("line", function(data) {

	dataBuffer = {
		logdata: data,
		type: 'log'
	};

	ws.send(JSON.stringify(dataBuffer));	

});

tail.on("error", function(error) {

	console.log('ERROR: ', error);
});