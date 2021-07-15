var config = require("./config")();

var WebSocketServer = require("ws").Server;
var wsServer = new WebSocketServer({port:config.port});

var logfile = config.logfile;

Tail = require('tail').Tail;
tail = new Tail(logfile);

var dataBuffer;

wsServer.on("connection", function (ws) {

    console.log("Connection established!");
    ws.on("message", function (msg) {

        console.log("Received:", msg);
		if (msg == "reload") {
			ws.send(JSON.stringify(dataBuffer));
		}
    });

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
});

