var WebSocketServer = require("ws").Server;
var wsServer = new WebSocketServer({port:3000});
 
Tail = require('tail').Tail;
tail = new Tail("/var/log/httpd/catalyst-error.log");

var dataBuffer;

wsServer.on("connection", function (ws) {

    console.log("Connection established!");
    ws.on("message", function (msg) {

        ws.send("Got your message!");
        console.log("Received:", msg);
		if (msg == "reload") {
			ws.send(dataBuffer);
		}
    });

    tail.on("line", function(data) {

		dataBuffer =  data;
        ws.send(dataBuffer);
    });

	tail.on("error", function(error) {
		
		console.log('ERROR: ', error);
	});
});

